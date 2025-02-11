import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("src/firestorekey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Define all schemes with correct field structure
schemes = [
    # 🌾 Agriculture & Farming Schemes
    {
        "name": "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
        "category": "Agriculture",
        "eligibility_criteria": {
            "land_size_limit": 2,  # In hectares
            "income_limit": None,
            "aadhaar_required": True,
            "govt_employee_restricted": True
        },
        "benefits": "₹6,000/year in 3 installments",
        "applicable_states": ["All"]
    },
    {
        "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "category": "Agriculture",
        "eligibility_criteria": {
            "land_size_limit": None,
            "income_limit": None,
            "loan_mandatory": True
        },
        "benefits": "Crop insurance against natural calamities",
        "applicable_states": ["All"]
    },
    {
        "name": "Kisan Credit Card (KCC)",
        "category": "Finance",
        "eligibility_criteria": {
            "age_range": [18, 75],
            "land_ownership_required": True
        },
        "benefits": "Low-interest credit (up to ₹3 lakh)",
        "applicable_states": ["All"]
    },
    {
        "name": "Rashtriya Krishi Vikas Yojana (RKVY)",
        "category": "Agriculture",
        "eligibility_criteria": {
            "state_government_project_required": True
        },
        "benefits": "Grants to improve agriculture productivity",
        "applicable_states": ["All"]
    },
    {
        "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
        "category": "Agriculture",
        "eligibility_criteria": {
            "organic_farming_required": True
        },
        "benefits": "Financial support for organic farming",
        "applicable_states": ["All"]
    },
    {
        "name": "Soil Health Card Scheme",
        "category": "Agriculture",
        "eligibility_criteria": {
            "registered_farmers_only": True
        },
        "benefits": "Provides soil quality assessment & fertilizer recommendations",
        "applicable_states": ["All"]
    },
    {
        "name": "PM Krishi Sinchayee Yojana (PMKSY)",
        "category": "Irrigation",
        "eligibility_criteria": {
            "land_ownership_required": True
        },
        "benefits": "Subsidized irrigation equipment",
        "applicable_states": ["All"]
    },

    # 🐄 Animal Husbandry & Fisheries Schemes
    {
        "name": "National Livestock Mission (NLM)",
        "category": "Animal Husbandry",
        "eligibility_criteria": {
            "livestock_farmers_only": True
        },
        "benefits": "Support for poultry, dairy, and livestock farmers",
        "applicable_states": ["All"]
    },
    {
        "name": "Dairy Entrepreneurship Development Scheme (DEDS)",
        "category": "Animal Husbandry",
        "eligibility_criteria": {
            "dairy_farmers_only": True
        },
        "benefits": "Funding for dairy farmers",
        "applicable_states": ["All"]
    },
    {
        "name": "Blue Revolution Scheme",
        "category": "Fisheries",
        "eligibility_criteria": {
            "registered_fisheries_only": True
        },
        "benefits": "Subsidies for fisheries & aquaculture development",
        "applicable_states": ["All"]
    },

    # 💰 Financial & Welfare Schemes
    {
        "name": "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
        "category": "Employment",
        "eligibility_criteria": {
            "age_limit": 18,
            "rural_residency_required": True
        },
        "benefits": "100 days of guaranteed wage employment",
        "applicable_states": ["All"]
    },
    {
        "name": "PM Awas Yojana - Gramin (PMAY-G)",
        "category": "Housing",
        "eligibility_criteria": {
            "household_type": "rural",
            "must_be_on_SECC_list": True
        },
        "benefits": "Subsidized rural housing",
        "applicable_states": ["All"]
    },
    {
        "name": "Aajeevika – National Rural Livelihoods Mission (NRLM)",
        "category": "Livelihood",
        "eligibility_criteria": {
            "women_self_help_groups": True
        },
        "benefits": "Microfinance & skill development",
        "applicable_states": ["All"]
    },
    {
        "name": "National Social Assistance Programme (NSAP)",
        "category": "Welfare",
        "eligibility_criteria": {
            "BPL_only": True,
            "for_elderly_widows_disabled": True
        },
        "benefits": "Monthly pension support",
        "applicable_states": ["All"]
    },
    {
        "name": "PM Ujjwala Yojana",
        "category": "Welfare",
        "eligibility_criteria": {
            "BPL_only": True,
            "aadhaar_required": True
        },
        "benefits": "Free LPG connections for rural households",
        "applicable_states": ["All"]
    },

    # 🎯 State-Specific Schemes
    {
        "name": "Rythu Bandhu Scheme",
        "category": "Agriculture",
        "eligibility_criteria": {
            "state_specific": "Telangana",
            "land_size_limit": 5,
            "aadhaar_required": True
        },
        "benefits": "₹5,000 per acre per season",
        "applicable_states": ["Telangana"]
    },
    {
        "name": "Kalia Scheme",
        "category": "Agriculture",
        "eligibility_criteria": {
            "state_specific": "Odisha",
            "land_size_limit": 2,
            "must_be_on_SECC_list": True
        },
        "benefits": "₹10,000/year financial support",
        "applicable_states": ["Odisha"]
    },
    {
        "name": "Krishak Bandhu Scheme",
        "category": "Agriculture",
        "eligibility_criteria": {
            "state_specific": "West Bengal",
            "registered_with_agriculture_department": True
        },
        "benefits": "₹10,000/year financial support",
        "applicable_states": ["West Bengal"]
    },
    {
        "name": "Mukhyamantri Krishi Aashirwad Yojana",
        "category": "Agriculture",
        "eligibility_criteria": {
            "state_specific": "Jharkhand",
            "land_size_limit": 5,
            "aadhaar_required": True
        },
        "benefits": "₹5,000 per acre (max 5 acres)",
        "applicable_states": ["Jharkhand"]
    }
]

# Upload data to Firestore
for scheme in schemes:
    db.collection("schemes").add(scheme)

print("✅ All schemes uploaded successfully!")