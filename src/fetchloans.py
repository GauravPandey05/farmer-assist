import firebase_admin
from firebase_admin import credentials, firestore

# Step 1: Initialize Firebase
cred = credentials.Certificate("src/firestorekey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def fetch_loans(user_input):
    """
    Fetches and ranks loan schemes based on the farmer's eligibility and profitability.

    :param user_input: Dictionary containing user attributes (land_size, income, state, etc.)
    :return: List of ranked applicable loan schemes
    """

    loans_ref = db.collection("loans")
    results = loans_ref.stream()
    applicable_loans = []

    for loan in results:
        loan_data = loan.to_dict()

        # Debugging: Print each loan data for verification
        print(f"Checking loan: {loan_data.get('name', 'Unknown')}")

        # Apply land size limit
        land_limit = loan_data.get("max_land_size")
        if land_limit is not None and user_input.get("land_size", 0) > land_limit:
            continue  # Land size exceeds the max limit

        # Apply income limit
        income_limit = loan_data.get("max_income")
        if income_limit is not None and user_input.get("income", 0) > income_limit:
            continue  # Income exceeds the max limit

        # Aadhaar Requirement
        if loan_data.get("aadhaar_needed", False) and not user_input.get("aadhaar_available", False):
            continue  # Aadhaar is required, but user does not have it

        # Government Employee Restriction
        if loan_data.get("is_govt_employee", False) and user_input.get("is_govt_employee", False):
            continue  # User is a government employee, but loan restricts government employees

        # State Filter (Ensure applicable_states is a list)
        applicable_states = loan_data.get("applicable_states", [])
        if not isinstance(applicable_states, list):
            applicable_states = []

        if "state" in user_input and user_input["state"] not in applicable_states and "All" not in applicable_states:
            continue  # Exclude loan if state is not in the list

        # Store eligible loan
        applicable_loans.append(loan_data)

    return applicable_loans

# Example Input: Farmer Details
user_input = {
    "land_size": 2,  # 2 hectares
    "income": 45000,  # Annual income
    "aadhaar_available": True,
    "is_govt_employee": False,
    "state": "Odisha"
}

# Get applicable loans
applicable_loans = fetch_loans(user_input)

# Print results
print("\n🔹🔹🔹 APPLICABLE LOANS FOR YOU 🔹🔹🔹\n")
if applicable_loans:
    for i, loan in enumerate(applicable_loans, start=1):
        print(f"🏆 {i}. {loan.get('name', 'Unknown')}")
        print(f"   💰 Loan Amount: ₹{loan.get('loan_amount', 'N/A')}")
        print(f"   📉 Interest Rate: {loan.get('interest_rate', 'N/A')}%")
        print("-" * 40)
else:
    print("❌ No applicable loan schemes found for your criteria.")
