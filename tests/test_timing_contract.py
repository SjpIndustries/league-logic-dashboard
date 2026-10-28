"""Exercise the published schemas, not either Streamlit validator implementation."""
from copy import deepcopy
import unittest

from jsonschema import Draft202012Validator
from referencing import Registry, Resource
from referencing.jsonschema import DRAFT202012
from openapi_spec_validator import validate

from validate_openapi import load_spec

SPEC = load_spec()
URI = "urn:leaguelogic:openapi"
REGISTRY = Registry().with_resource(
    URI, Resource.from_contents(SPEC, default_specification=DRAFT202012)
)


def validator(name):
    return Draft202012Validator(
        {"$ref": f"{URI}#/components/schemas/{name}"}, registry=REGISTRY
    )


def snapshot(minutes, state, optimal=False):
    return {
        "t_minus_minutes": minutes, "state": state, "optimal": optimal,
        "rules": {"min_minutes": 30, "max_minutes": 90, "optimal_minutes": 33},
        "search_rules": {"min_minutes": 30, "max_minutes": 240},
    }


class TimingContractTests(unittest.TestCase):
    def test_openapi_is_valid(self):
        validate(SPEC)

    def test_validator_boundaries_and_contradictions(self):
        # Explicit independent expectations: no copy of production timing logic.
        cases = [
            (240.01, "DISQUALIFIED", False), (240, "DISQUALIFIED", False),
            (239.99, "DISQUALIFIED", False), (120, "DISQUALIFIED", False),
            (90.01, "DISQUALIFIED", False), (90, "VALID", False),
            (89.99, "VALID", False), (45, "VALID", False),
            (33.01, "VALID", False), (33, "VALID", True),
            (32.99, "VALID", False), (30.01, "VALID", False),
            (30, "VALID", False), (29.99, "DISQUALIFIED", False),
            (1, "DISQUALIFIED", False), (0, "DISQUALIFIED", False),
            (-0.01, "DISQUALIFIED", False), (-1, "DISQUALIFIED", False),
        ]
        schema = validator("ValidatorResponse")
        for minutes, state, optimal in cases:
            with self.subTest(minutes=minutes):
                payload = snapshot(minutes, state, optimal)
                schema.validate(payload)
                wrong_state = deepcopy(payload)
                wrong_state["state"] = "VALID" if state == "DISQUALIFIED" else "DISQUALIFIED"
                self.assertFalse(schema.is_valid(wrong_state))
                payload["optimal"] = not optimal
                self.assertFalse(schema.is_valid(payload))

    def test_execution_success_cannot_claim_invalid_timing(self):
        schema = validator("ExecutionResponse")
        for minutes in (90, 89.99, 45, 33, 30.01, 30):
            with self.subTest(minutes=minutes):
                schema.validate({"t_minus_minutes": minutes, "status": "VALID"})
        for minutes in (240, 90.01, 29.99, 0, -0.01):
            with self.subTest(minutes=minutes):
                self.assertFalse(schema.is_valid({"t_minus_minutes": minutes, "status": "VALID"}))
        self.assertFalse(schema.is_valid({"t_minus_minutes": 33, "status": "DISQUALIFIED"}))
        self.assertFalse(schema.is_valid({"status": "VALID"}))
        self.assertFalse(schema.is_valid({"t_minus_minutes": 33}))

    def test_timing_rejection_cannot_claim_valid_or_optimal(self):
        schema = validator("ValidatorError")
        for minutes in (240, 90.01, 29.99, 0, -1):
            payload = {"error": {"code": "OUTSIDE_EXECUTION_WINDOW"},
                       "t_minus_minutes": minutes, "state": "DISQUALIFIED", "optimal": False}
            schema.validate(payload)
            payload["state"] = "VALID"
            self.assertFalse(schema.is_valid(payload))
        for minutes in (90, 33, 30):
            self.assertFalse(schema.is_valid({"error": {}, "t_minus_minutes": minutes,
                                             "state": "DISQUALIFIED", "optimal": minutes == 33}))

    def test_required_timing_fields_and_fixed_rule_values(self):
        schema = validator("ValidatorResponse")
        good = snapshot(33, "VALID", True)
        for field in ("t_minus_minutes", "state", "optimal", "rules", "search_rules"):
            payload = deepcopy(good)
            del payload[field]
            self.assertFalse(schema.is_valid(payload), field)
        for group, field, value in (("rules", "max_minutes", 240), ("rules", "min_minutes", 0),
                                    ("rules", "optimal_minutes", 30), ("search_rules", "max_minutes", 90),
                                    ("search_rules", "min_minutes", 0)):
            payload = deepcopy(good)
            payload[group][field] = value
            self.assertFalse(schema.is_valid(payload), (group, field))
        for value in ("33", None, True):
            payload = deepcopy(good)
            payload["t_minus_minutes"] = value
            self.assertFalse(schema.is_valid(payload))

    def test_endpoint_contracts_reference_timing_schemas(self):
        for path, method, code, name in (
            ("/validator/{fixture_id}", "get", "200", "ValidatorResponse"),
            ("/validator/{fixture_id}", "get", "409", "ValidatorError"),
            ("/execute/{fixture_id}", "post", "200", "ExecutionResponse"),
        ):
            schema = SPEC["paths"][path][method]["responses"][code]["content"]["application/json"]["schema"]
            self.assertEqual(schema["$ref"], f"#/components/schemas/{name}")
        for path, method in (("/live-data/{fixture_id}/parse", "post"), ("/live-data/{fixture_id}", "put")):
            operation = SPEC["paths"][path][method]
            self.assertIn("T-240 through T-30 inclusive", operation["description"])
            self.assertIn("409", operation["responses"])
        execution = SPEC["paths"]["/execute/{fixture_id}"]["post"]
        self.assertIn("T-90 through T-30", execution["description"])
        self.assertIn("T-33 is optimal, not mandatory", execution["description"])
        self.assertNotIn("T-240 execution", SPEC["info"]["description"])


if __name__ == "__main__":
    unittest.main()
