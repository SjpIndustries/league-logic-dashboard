
import streamlit as st
import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import matplotlib.pyplot as plt

st.set_page_config(page_title="LeagueLogic V2.1", layout="wide")

# Google Sheets authentication
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("secrets.json", scope)
client = gspread.authorize(creds)

# Load the Prediction Log
sheet = client.open_by_url("https://docs.google.com/spreadsheets/d/1YDkRSzh0pWVn7IYInXHdiGhOnvo0zXNgXYKxp_Ep0Ac")
worksheet = sheet.worksheet("Charts Helper")
data = worksheet.get_all_records()
df = pd.DataFrame(data)

# Layout — KPIs
st.title("LEAGUELOGIC V2.1 — INVESTOR DASHBOARD")
st.markdown("### 🔥 Powered by AI — Backed by Performance")

col1, col2, col3, col4 = st.columns(4)
col1.metric("Correct Tips", int(df["Outcome Score (1/0)"].sum()))
col2.metric("Total Tips", len(df))
col3.metric("Avg Confidence (Correct)", f"{round(df[df['Outcome Score (1/0)'] == 1]['Confidence %'].mean(), 1)}%")
profit = df["ROI per tip"].sum()
col4.metric("Simulated ROI ($100)", f"${profit:.2f}", delta=None)

st.divider()

# Accuracy Line Chart
st.subheader("Prediction Accuracy Over Time")
fig1, ax1 = plt.subplots()
ax1.plot(df.index + 1, df["Outcome Score (1/0)"] * 100, marker='o')
ax1.set_xlabel("Tip #")
ax1.set_ylabel("Accuracy (%)")
ax1.set_ylim(0, 100)
ax1.set_title("Accuracy Per Match")
st.pyplot(fig1)

# ROI Bar Chart
st.subheader("ROI Per Tip ($100 Bets)")
fig2, ax2 = plt.subplots()
ax2.bar(df.index + 1, df["ROI per tip"], color="gold")
ax2.axhline(0, color='white', linestyle='--')
ax2.set_xlabel("Tip #")
ax2.set_ylabel("Profit / Loss ($)")
st.pyplot(fig2)

# Donut Chart
st.subheader("Correct vs Incorrect Tips")
correct = df["Outcome Score (1/0)"].sum()
incorrect = len(df) - correct
fig3, ax3 = plt.subplots()
ax3.pie([correct, incorrect], labels=["Correct", "Incorrect"], startangle=90,
        colors=["green", "red"], wedgeprops=dict(width=0.4))
ax3.set_title("Tip Accuracy Split")
st.pyplot(fig3)
