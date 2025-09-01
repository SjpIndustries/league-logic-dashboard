from openapi_spec_validator import validate_spec
import yaml

with open('openapi.yaml') as f:
    spec = yaml.safe_load(f)

validate_spec(spec)
print('openapi.yaml is valid.')
