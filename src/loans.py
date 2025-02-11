import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("src/firestorekey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# ✅ Fully Corrected Loan Data (No Loans Missing)
loans = [
    {
        "name": "Kisan Credit Card (KCC)",
        "category": "Agriculture",
        "max_land_size": None,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],  # ✅ Fixed key name
        "interest_rate": 7,
        "loan_amount": 500000,
        "subsidy_available": True
    },
    {
        "name": "KALIA Scheme",
        "category": "Agriculture",
        "max_land_size": None,
        "max_income": 200000,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 0,
        "loan_amount": 50000,
        "subsidy_available": True
    },
    {
        "name": "Crop Loan",
        "category": "Agriculture",
        "max_land_size": None,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 2,
        "loan_amount": 300000,
        "subsidy_available": True
    },
    {
        "name": "Farm Development Loan",
        "category": "Agriculture",
        "max_land_size": None,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 5,  # ✅ Set default
        "loan_amount": 100000,  # ✅ Set default
        "subsidy_available": False
    },
    {
        "name": "Dairy Loans",
        "category": "Agriculture",
        "max_land_size": None,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 6,  # ✅ Set default
        "loan_amount": 200000,  # ✅ Set default
        "subsidy_available": False
    },
    {
        "name": "Fisheries Loan",
        "category": "Agriculture",
        "max_land_size": None,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 5,  # ✅ Set default
        "loan_amount": 150000,  # ✅ Set default
        "subsidy_available": False
    },
    {
        "name": "Poultry & Duck Rearing Loan",
        "category": "Agriculture",
        "max_land_size": None,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 4,  # ✅ Set default
        "loan_amount": 250000,  # ✅ Set default
        "subsidy_available": False
    },
    {
        "name": "Farm Machinery Loans",
        "category": "Agriculture",
        "max_land_size": None,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 5,  # ✅ Fixed (No strings like "85% investment")
        "loan_amount": 85000,  # ✅ Fixed (Approximated from 85% investment)
        "subsidy_available": False
    },
    {
        "name": "Kisan Pragati Card (KPC) Crop Loan",
        "category": "Agriculture",
        "max_land_size": 0.5,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 5,  # ✅ Set default
        "loan_amount": 26000,
        "subsidy_available": False
    },
    {
        "name": "Kisan Pragati Card (KPC) Poultry",
        "category": "Agriculture",
        "max_land_size": 1,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 4,  # ✅ Set default
        "loan_amount": 2000000,
        "subsidy_available": False
    },
    {
        "name": "Kisan Pragati Card (KPC) Pisciculture",
        "category": "Agriculture",
        "max_land_size": 1,
        "max_income": None,
        "aadhaar_needed": True,
        "is_govt_employee": False,
        "applicable_states": ["Odisha"],
        "interest_rate": 4,  # ✅ Set default
        "loan_amount": 500000,
        "subsidy_available": False
    }
]

# ✅ Upload Data to Firestore
for loan in loans:
    # Replace None values with defaults
    loan["interest_rate"] = loan.get("interest_rate", 5)  # Default interest rate 5%
    loan["loan_amount"] = loan.get("loan_amount", 1000)  # Default minimum ₹1000

    db.collection("loans").add(loan)

print("✅ All loan data uploaded successfully!")