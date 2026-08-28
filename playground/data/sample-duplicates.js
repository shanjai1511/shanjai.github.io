/* Representative/synthetic demo CSV (as text, run through the real PG.parseCSV
   the same way an uploaded file would be) — deliberately contains exact
   duplicate rows (accidental double entry) and near-duplicate rows (same
   person, one field differs — a changed signup date or a typo'd email) for
   the Duplicate Detector to find. Not real customer/client data. */
const PG_SAMPLE_DUPLICATES_CSV =
`name,email,city,signup_date
Ananya Rao,ananya.rao@mail.com,Bengaluru,2024-01-12
Vikram Shah,vikram.shah@mail.com,Mumbai,2024-01-15
Ananya Rao,ananya.rao@mail.com,Bengaluru,2024-01-12
Priya Nair,priya.nair@mail.com,Kochi,2024-02-01
Rohan Mehta,rohan.mehta@mail.com,Pune,2024-02-03
Priya Nair,priya.nair@mail.com,Kochi,2024-02-01
Sanjay Gupta,sanjay.gupta@mail.com,Delhi,2024-02-10
Rohan Mehta,rohan.mehta@mail.com,Pune,2024-02-20
Neha Verma,neha.verma@mail.com,Hyderabad,2024-02-14
Arjun Singh,arjun.singh@mail.com,Chennai,2024-02-18
Neha Verma,n.verma@mail.com,Hyderabad,2024-02-14
Kavya Reddy,kavya.reddy@mail.com,Bengaluru,2024-03-01
Vikram Shah,vikram.shah@mail.com,Mumbai,2024-03-05
Meera Iyer,meera.iyer@mail.com,Chennai,2024-03-08`;
