import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import ReactPaginate from 'react-paginate';
import { AutoComplete } from 'primereact/autocomplete';
import { Toast } from 'primereact/toast';
import refresh from '../../image/refresh.svg';
import downArrow from '../../image/down-arrow.svg';
import upArrow from '../../image/up-arrow.svg';
import { format } from "date-fns";
import { FilterIcon } from 'lucide-react';



// Header labels mapping
const headerLabels = {
    cmid: { label: "CMID" },
    partyName: { label: "Account Name" },
    surfId: { label: "Account Number" },
    partyTyp: { label: "Account Type" },
    dunsNmbr: { label: "DUNS Number" },
    mdmId: { label: "MDM ID" },
    website: { label: "Website", width: "250px" },         // extra width

    stockTicker: { label: "Stock Ticker" },
    addr: { label: "Address", width: "320px" },            // extra width
    city: { label: "City" },
    state: { label: "State" },
    countryCd: { label: "Country" },
    confidenceScore: { label: "Confidence Score" },
    matchReason: { label: "Match Reason", width: "250px" }, // extra width  
    rankBasedOnACV: { label: "Rank based on ACV" },
};



const modeList = ['Probabilistic', 'Median', 'Deterministic', 'Primary'];

const countryList = [
    { name: "United States", code: "US" },
    { name: "Afghanistan", code: "AF" },
    { name: "Albania", code: "AL" },
    { name: "Algeria", code: "DZ" },
    { name: "Andorra", code: "AD" },
    { name: "Angola", code: "AO" },
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Argentina", code: "AR" },
    { name: "Armenia", code: "AM" },
    { name: "Australia", code: "AU" },
    { name: "Austria", code: "AT" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahamas", code: "BS" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Barbados", code: "BB" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Belize", code: "BZ" },
    { name: "Benin", code: "BJ" },
    { name: "Bhutan", code: "BT" },
    { name: "Bolivia", code: "BO" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Botswana", code: "BW" },
    { name: "Brazil", code: "BR" },
    { name: "Brunei Darussalam", code: "BN" },
    { name: "Bulgaria", code: "BG" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cabo Verde", code: "CV" },
    { name: "Cambodia", code: "KH" },
    { name: "Cameroon", code: "CM" },
    { name: "Canada", code: "CA" },
    { name: "Central African Republic", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Colombia", code: "CO" },
    { name: "Comoros", code: "KM" },
    { name: "Congo", code: "CG" },
    { name: "Congo (Democratic Republic of the)", code: "CD" },
    { name: "Costa Rica", code: "CR" },
    { name: "Croatia", code: "HR" },
    { name: "Cuba", code: "CU" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Djibouti", code: "DJ" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "Ecuador", code: "EC" },
    { name: "Egypt", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Estonia", code: "EE" },
    { name: "Eswatini", code: "SZ" },
    { name: "Ethiopia", code: "ET" },
    { name: "Fiji", code: "FJ" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Georgia", code: "GE" },
    { name: "Germany", code: "DE" },
    { name: "Ghana", code: "GH" },
    { name: "Greece", code: "GR" },
    { name: "Grenada", code: "GD" },
    { name: "Guatemala", code: "GT" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Guyana", code: "GY" },
    { name: "Haiti", code: "HT" },
    { name: "Honduras", code: "HN" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Ireland", code: "IE" },
    { name: "Israel", code: "IL" },
    { name: "Italy", code: "IT" },
    { name: "Jamaica", code: "JM" },
    { name: "Japan", code: "JP" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kenya", code: "KE" },
    { name: "Kiribati", code: "KI" },
    { name: "Korea (Democratic People's Republic of)", code: "KP" },
    { name: "Korea (Republic of)", code: "KR" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Lao People's Democratic Republic", code: "LA" },
    { name: "Latvia", code: "LV" },
    { name: "Lebanon", code: "LB" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libya", code: "LY" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mali", code: "ML" },
    { name: "Malta", code: "MT" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Mexico", code: "MX" },
    { name: "Micronesia", code: "FM" },
    { name: "Moldova", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Mongolia", code: "MN" },
    { name: "Montenegro", code: "ME" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Myanmar", code: "MM" },
    { name: "Namibia", code: "NA" },
    { name: "Nauru", code: "NR" },
    { name: "Nepal", code: "NP" },
    { name: "Netherlands", code: "NL" },
    { name: "New Zealand", code: "NZ" },
    { name: "Nicaragua", code: "NI" },
    { name: "Niger", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "Norway", code: "NO" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palau", code: "PW" },
    { name: "Panama", code: "PA" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Philippines", code: "PH" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Qatar", code: "QA" },
    { name: "Romania", code: "RO" },
    { name: "Russian Federation", code: "RU" },
    { name: "Rwanda", code: "RW" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Samoa", code: "WS" },
    { name: "San Marino", code: "SM" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Senegal", code: "SN" },
    { name: "Serbia", code: "RS" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Singapore", code: "SG" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Sudan", code: "SS" },
    { name: "Spain", code: "ES" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Sudan", code: "SD" },
    { name: "Suriname", code: "SR" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Syrian Arab Republic", code: "SY" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Tanzania", code: "TZ" },
    { name: "Thailand", code: "TH" },
    { name: "Timor-Leste", code: "TL" },
    { name: "Togo", code: "TG" },
    { name: "Tonga", code: "TO" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "Tunisia", code: "TN" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "Tuvalu", code: "TV" },
    { name: "Uganda", code: "UG" },
    { name: "Ukraine", code: "UA" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "United Kingdom", code: "GB" },
    { name: "Uruguay", code: "UY" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vanuatu", code: "VU" },
    { name: "Venezuela", code: "VE" },
    { name: "Viet Nam", code: "VN" },
    { name: "Yemen", code: "YE" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" }
];


const MatchAccountForm = () => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [formData, setFormData] = useState({
        accountnm: "",
        website: "",
        country: "",
        dunsnumber: "",
        stockticker: "",
        mode: "Deterministic",
    });

    const clearForm = () => {
        setCountryError('');
        setFormData({
            accountnm: "",
            website: "",
            country: "",
            dunsnumber: "",
            stockticker: "",
            mode: "Deterministic",
        });
        setResponseGenerated(false);
        setInputValue('');
        setNoResponse(false);
    };



    const defaultFormData = {
        accountnm: "",
        website: "",
        country: "",
        dunsnumber: "",
        stockticker: "",
        mode: "Deterministic",
        // ... reset other form fields as needed
    };
    const [accountnmError, setaccountnmError] = useState("");
    const [countryError, setCountryError] = useState("");
    const [combinedErrorMessage, setCombinedErrorMessage] = useState("");

    const [touchedFields, setTouchedFields] = useState({});
    const [responseData, setResponseData] = useState({});
    const [isError, setIsError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [activeTab, setActiveTab] = useState('single');
    const [modeError, setmodeError] = useState('');
    const [loading, setLoading] = useState(false);
    const [excelMode, setExcelMode] = useState("deterministic");


    const [dataFormateActiveTab, setDataFormateActiveTab] = useState('table');
    const [noResponse, setNoResponse] = useState(false);

    const [currentItems, setCurrentItems] = useState([]);
    const [bulkData, setBulkData] = useState([]);
    const [bulkDataFileName, setBulkDataFileName] = useState([]);
    const [showBulkDataTable, setShowBulkDataTable] = useState(true);
    const [bulkRequestBatchId, setBulkRequestBatchId] = useState('');

    const [currentPage, setCurrentPage] = useState(0);



    const [searchTerm, setSearchTerm] = useState('');
    const [selectedColumn, setSelectedColumn] = useState('All');
    const itemsPerPage = 10;
    const [filteredmodes, setFilteredmodes] = useState(['Probabilistic', 'Median', 'Deterministic', 'Primary']);
    const [responseGenerated, setResponseGenerated] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');
    const originalFileRef = useRef(null);
    const [originalFile, setOriginalFile] = useState(null);

    const searchmode = (event) => {
        const query = event.query.toLowerCase();
        const allOptions = ['Probabilistic', 'Median', 'Deterministic', 'Primary'];
        const filtered = allOptions.filter(type =>
            type.toLowerCase().includes(query)
        );
        setFilteredmodes(filtered);
    };

    // Column options for the dropdown
    const columns = [
        { label: "All", value: "All" },
        { label: "Account Name", value: "accountname" },
        { label: "Country", value: "country" },
        { label: "Website", value: "website" },
        { label: "Stock Ticker", value: "stockticker" },
        
    ];


    useEffect(() => {

        const filteredData = bulkData.filter((item) => {
            if (searchTerm.length >= 1) {
                // Search term is at least one character long
                if (selectedColumn === 'All') {
                    return Object.values(item).some((value) =>
                        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
                // Search in the selected column
                return item[selectedColumn]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
            } else if (searchTerm.length === 0) {
                // When searchTerm is empty, you may want to return all items (no filter)
                return true;
            }
        }, [searchTerm, selectedColumn]); // Ensure to also watch for changes in selectedColumn

        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        setCurrentItems(filteredData.slice(start, end));
    }, [bulkData, currentPage, searchTerm, selectedColumn]);

    let intervalId;
    useEffect(() => {
        setIsDisabled(false);
        setBulkRequestBatchId(false);
        if (activeTab === "request_status") {
            // Start a timer that calls a function every 1 minute
            intervalId = setInterval(() => {
                handleTabClick("request_status");
            }, 60000); // 1 minute = 60000 ms
        } else {
            // Clear the interval when activeTab is not "request_status"
            clearInterval(intervalId);
        }

        // Cleanup function to clear the interval when the component unmounts or activeTab changes
        return () => clearInterval(intervalId);
    }, [activeTab]);


    const [filteredCountries, setFilteredCountries] = useState([]);
    const [inputValue, setInputValue] = useState(''); // Store typed text separately

    const formatConfidenceScore = (score) => {
        // Ensure the score is a number and return it as an integer
        return isNaN(score) ? null : parseFloat(score).toFixed(0);
    };

    const handleCountryChange = (e) => {
        setResponseGenerated(false);
        setCombinedErrorMessage('');
        if (e?.value?.name) {
            setInputValue(e?.value?.code + '-' + e?.value?.name);

        } else {
            setInputValue(e.value);
        }
        // Update inputValue with the text typed by the user

        setFormData({
            ...formData,
            country: e.value?.code
        });


        if (!e.value?.code) {
            setCountryError("");
        } else {
            const codeExists = countryList.some(country => country.code === e.value?.code.toUpperCase());
            if (!codeExists) {
                setCountryError("Please select correct country.");
            } else {
                setCountryError(""); // Clear any previous error
            }
        }

    };

    const handleCountrySelect = (e) => {
        setFormData({
            ...formData,
            country: e.value.code // Update country code in formData on selection
        });



        setInputValue(e?.value?.code + ' - ' + e?.value?.name); // Show the selected country code in the input

        if (!e.value?.code) {
            setCountryError("");
        } else {
            const codeExists = countryList.some(country => country.code === e.value?.code.toUpperCase());
            if (!codeExists) {
                setCountryError("Please select correct country.");
            } else {
                setCountryError(""); // Clear any previous error
            }
        }
    };

    const handlemodeChange = (e) => {

        const selectedValue = e?.value;
        const selectedName = selectedValue?.name || selectedValue || '';

        setFormData((prevFormData) => ({
            ...prevFormData,
            mode: selectedValue, // Save the full object or string
        }));

        if (!selectedName) {
            setmodeError("Please select a Match Type.");
        } else if (!modeList.includes(selectedName)) {
            setmodeError("Please select a correct Match Type.");
        } else {
            setmodeError("");
        }
    };

    const handlemodeSelect = (e) => {
        const selectedValue = e?.value;
        const selectedName = selectedValue?.name || selectedValue || '';
        // console.log("selectedName:"+selectedName);

        setFormData((prevFormData) => ({
            ...prevFormData,
            mode: selectedValue, // Keep consistent with change handler
        }));

        if (!selectedName) {
            setmodeError("Please select a Mode Type.");
        } else if (!modeList.includes(selectedName)) {
            setmodeError("Please select a correct Mode Type.");
        } else {
            setmodeError("");
        }
    };


    const searchCountry = (event) => {
        const query = event.query.toLowerCase();
        const results = countryList.filter(country =>
            country.name.toLowerCase().includes(query)
        );
        setFilteredCountries(results);
    };

    const countryOptionTemplate = (option) => (
        <div>
            <span>{option.code} - {option.name}</span>
        </div>
    );





    const handleChange = (e) => {
        const { name, value } = e.target;
        setResponseGenerated(false);
        setCombinedErrorMessage('');
        setNoResponse(false);

        setFormData({

            ...formData,
            [name]: value
        });
        // if (name === "accountnm") {
        //   //  validateName(value);
        // }
    };

    const validateName = (value) => {
        if (!value) {
            setaccountnmError("name is required.");
        } else if (!/^[a-z0-9.-]+$/i.test(value)) {
            setaccountnmError("Please enter a valid name ");
        } else {
            setaccountnmError("");
        }
    };

    const handleBlur = (e) => {
        setNoResponse(false);
        const { name } = e.target;

        setTouchedFields((prev) => ({
            ...prev,
            [name]: true
        }));

        if (name === 'name') {
            const input = typeof inputValue === 'string' ? inputValue.trim() : inputValue?.name?.trim();

            if (!input) {
                setInputValue(null);
               // setCountryError('Please select a valid country from the list.');
                return;
            }

            const matchedCountry = countryList.find(
                country => country.name.toLowerCase().includes(input.toLowerCase())
            );

            if (matchedCountry) {
                setInputValue(matchedCountry); // Auto-select best match
                setCountryError('');

                // ✅ Automatically trigger submission or next action
                handleCountrySelect({ value: matchedCountry });
            } else {
                //setInputValue(null);
                // setCountryError('Please select a valid country from the list.');
            }
        }
    };


    const handleSubmit = async (e) => {

        setIsDisabled(false);
        setIsError(false);
        setNoResponse(false);
        e.preventDefault();

        // Update touched fields using setState

        setTouchedFields((prevTouched) => ({ ...prevTouched, code: true, accountnm: true }));
        setCombinedErrorMessage('');
        let valid = true;
        let errorMessages = [];



        // name validation
        // if (!formData.accountnm) {
        //     setaccountnmError("account name is required.");
        //     errorMessages.push("account name");
        //     valid = false;
        // } else if (!/^[a-z0-9.-]+$/i.test(formData.accountnm)) {
        //     setaccountnmError("Please enter a valid accountnm address.");
        //     errorMessages.push("InValid account name");
        //     valid = false;
        // } else {
        //     setaccountnmError(""); // Clear any previous error
        // }

        // // Country validation
        // if (!formData.country) {
        //     setCountryError("Please select country.");
        //     errorMessages.push("Country");
        //     valid = false;
        // } else {
        //     const codeExists = countryList.some(country => country.code === formData.country.toUpperCase());
        //     if (!codeExists) {
        //         setCountryError("Please select correct country.");
        //         errorMessages.push("Country");
        //         valid = false;
        //     } else {
        //         setCountryError(""); // Clear any previous error
        //     }
        // }

        // // mode validation
        // if (!formData.mode) {
        //     setmodeError("Please select Match Type.");
        //     errorMessages.push("Match Type");
        //     valid = false;
        // } else {
        //     const exists = ['Probabilistic', 'Median', 'Deterministic', ''].includes(formData.mode);
        //     console.log("Match Type Exists :"+exists);
        //     if (!exists) {
        //         setmodeError("Please select a correct Match Type.");
        //         errorMessages.push("Invalid Match Type");
        //         valid = false;
        //     } else {
        //         setmodeError("");
        //     }
        // }

        // If validation fails, show combined error message

        if (!formData.accountnm && !formData.country && !formData.stockticker && !formData.website && !formData.dunsnumber) {
            valid = false;
        }

        if (!valid) {
            setLoading(false);
            const tempCombinedErrorMessage = `Please provide any input`;
            setCombinedErrorMessage(tempCombinedErrorMessage);
            valid = true;
            return;
        } else {
            setLoading(true);
        }

        //setFormData(defaultFormData);
        setmodeError(""); // Clear error message if needed
        setCountryError("");

        try {
            const bearerToken = sessionStorage.getItem("authToken");
            const authHeader = `Bearer ${bearerToken}`;

            const queryParams = new URLSearchParams({
                accountnm: formData.accountnm ?? '',
                country: formData.country ?? '',
                website: formData.website ?? '',
                dunsnmbr: formData.dunsnumber ?? '',
                stockticker: formData.stockticker ?? '',
                mode: ((formData.mode ?? '').split(' ')[0]).toLowerCase(),
                // Add more fields as needed 
                // also for prod remove .toString() from below line
            }).toString();

            const inputData = {
                accountnm: formData.accountnm ?? '',
                country: formData.country ?? '',
                website: formData.website ?? '',
                dunsnmbr: formData.dunsnumber ?? '',
                stockticker: formData.stockticker ?? '',
                mode: ((formData.mode ?? '').split(' ')[0]).toLowerCase(),
            };
            // used in prod & also change method POST to GET
            // const res = await fetch(`${API_BASE_URL}/accountmatch/?${queryParams}`, {
            const res = await fetch(`${API_BASE_URL}/services/mdm/company/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },

                //for prod remove below line 
                body: JSON.stringify(inputData),

            });
            setIsDisabled(false);

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }


            const data = await res.json();
            console.log("data:"+data);
            let jsonArray = [];

            // Ensure data is treated as an array
            if (!Array.isArray(data)) {
                jsonArray.push(data);
            } else {
                jsonArray = data;
            }

            const isEmptyArrayOrEmptyObjects =
  !jsonArray ||
  jsonArray.length === 0 ||
  jsonArray.every(obj => Object.keys(obj).length === 0);

            if (isEmptyArrayOrEmptyObjects) {
                setNoResponse(true);
                setResponseGenerated(false);
            }else{

            // Rename 'matchScore' to 'confidenceScore' if it exists
            jsonArray = jsonArray.map(item => {
                const newItem = { ...item };

                // Rename 'matchScore' to 'confidenceScore'
                if ('matchScore' in newItem) {
                    newItem.confidenceScore = newItem.matchScore;
                    delete newItem.matchScore;
                }

                // Reorder to ensure 'matchReason' is last
                const { matchReason, ...rest } = newItem;

                return {
                    ...rest,
                    matchReason: matchReason || ''
                };
            });

            // Optional: Log to verify
            // console.log("Mapped JSON:", jsonArray);

            
            setResponseData(jsonArray);
            setResponseGenerated(true); // <-- mark that we got a response
            setIsError(false);

            setTimeout(() => {
                const tabContent = document.querySelector(".tab-content");
                if (tabContent) {
                    // Scroll the element into view
                    tabContent.scrollIntoView({ behavior: "smooth", block: "start" });

                }
            }, 250)
        } }catch (error) {
            setIsError(true);


        }
        finally {
            setLoading(false);

        }
    };

    const handleFileUpload = (event) => {
        setIsDisabled(false);
        const fileInput = event.target;
        const file = fileInput.files[0];

        if (!file) return;

        // Save original file (asynchronously)
        originalFileRef.current = file;

        console.log("Selected original file:", originalFileRef.current); // Log directly instead of originalFile state

        const reader = new FileReader();

        reader.onload = (e) => {
            const expectedKeys = {
                accountname: "accountname",
                country: "country",
                dunsnumber: "dunsnmbr",
                website: "website",
                stockticker: "stockticker",
                filename: "filename",
                mode: "mode"
            };

            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const originalData = XLSX.utils.sheet_to_json(worksheet);

            const jsonData = originalData.map(item => {
                const cleanedItem = {};
                const normalizedItem = {};

                for (let key in item) {
                    normalizedItem[key.toLowerCase()] = item[key];
                }

                for (let expectedKey in expectedKeys) {
                    const mappedKey = expectedKeys[expectedKey];
                    const value = normalizedItem[expectedKey];
                    if (value !== null && value !== undefined && value !== "") {
                        cleanedItem[mappedKey] = value;
                    }
                }

               // cleanedItem["mode"] = normalizedItem["mode"] || excelMode;
                return cleanedItem;
            });

            if (jsonData.length >= 50001) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'The bulk match account currently supports a maximum of 50000 records. Please upload an Excel file with no more than 50000 records.',
                    life: 12000,
                });
            } else {
                const formattedData = jsonData.map(record => {
                    const formattedRecord = { ...record };

                    if ('accountname' in formattedRecord) {
                        formattedRecord.accountnm = formattedRecord.accountname;
                        formattedRecord.mode = excelMode;
                    }

                    if (record.dunsnumber) {
                        formattedRecord.dunsnumber = String(record.dunsnumber);
                    }
                    if (record.globalduns) {
                        formattedRecord.globalduns = String(record.globalduns);
                    }
                    if (record.postalcode) {
                        formattedRecord.postalcode = String(record.postalcode);
                    }
                    if (record.postalcodeextn) {
                        formattedRecord.postalcodeextn = String(record.postalcodeextn);
                    }

                    return formattedRecord;
                });

                setBulkData(formattedData);
                setShowBulkDataTable(true);
                setBulkDataFileName(file.name.substring(0, file.name.lastIndexOf('.')));
                setCurrentPage(0);
            }

            // Reset input to allow re-selection of same file
            fileInput.value = null;
        };

        reader.readAsArrayBuffer(file);
    };





    const toast = useRef(null);

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success', detail: 'Bulk request processing start', life: 3000 });
    }


    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Bulk request fail.', life: 8000 });
    }

    const toPascalCase = (str) => {
        return str
            .replace(/(^\w|_\w)/g, (match) => match.replace('_', '').toUpperCase())
            .replace(/\s(.)/g, (match) => match.toUpperCase());

    };

const sendBulkRequest = async (e) => {
        e.preventDefault();
        setIsDisabled(true);
        setLoading(true);

        try {
             // Set matchMode in each item of bulkData
        const enrichedBulkData = bulkData.map(item => ({
            ...item,
            mode: excelMode
        }));

            let bulkRequestData = {
                "userEmail": sessionStorage.getItem("loginUserEmail"),
                leadRequest: enrichedBulkData,
                fileName: bulkDataFileName,
                matchMode: excelMode
            };

            const bearerToken = sessionStorage.getItem("authToken");
            const authHeader = `Bearer ${bearerToken}`;
            //const authHeader="Bearer eyJraWQiOiJZY2JnVlVZXzcwZmRNbk9mRURXNzhGSjI0RE5rRVhsU3RIR3J4LVlyQVN3IiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULlRhMllIcE5HbkozUWRfa2RzeUNfVHVFd0pFaVprRWR2V21uVmp6LWJCTUUiLCJpc3MiOiJodHRwczovL3NlcnZub3cub2t0YXByZXZpZXcuY29tL29hdXRoMi9hdXMxZTNvdjhweU04bjlPVjBoOCIsImF1ZCI6ImFwaTovL21zLmF6dXJlLmFwaW0uZ3cuaW9wIiwiaWF0IjoxNzM1ODAyNjI2LCJleHAiOjE3MzU4MDYyMjYsImNpZCI6IjBvYTI1M2dxNjJyQVFrckpUMGg4Iiwic2NwIjpbIm1kbS5jb250YWN0LnJlYWQiXSwic3ViIjoiMG9hMjUzZ3E2MnJBUWtySlQwaDgiLCJjbGllbnRJZCI6IjBvYTI1M2dxNjJyQVFrckpUMGg4IiwicmVxX3R5cGUiOiJzZXJ2ZXIifQ.wM0kB3i5cr2xt1v8NVaNBLDVxSQXuOZkNtMrTgXpQurHekD7tQbxTYYX7FXP8qPCITg14CElfPlQihOZuEzb6pSfPtTibQOS-3-sa8OuWy2BU-bOCauiUEZY56PiP9-I9XDI6id0JaUJ1d3frWFez_4q103T9pfdcLg8IXDwr6U-bNf6dozdEpFh0BL8m9JXnu4SiDh3t6XUS6TORxoUMNigpNQPHTFm5coF9OJ4aY4uQzvR5wnKhAQcuWChm3rZqtgVMCyUCzqf1h_d-49cz2F-Y4M8ORgF6jWMUEWsBTDvAc0qa1spYw6aAx8wfOSjA1F2h1qdb7AoyUMGBc-C8Q";


            const res = await fetch(`${API_BASE_URL}/services/mdm/company/match/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
                body: JSON.stringify(bulkRequestData),
            });

            if (!res.ok) {
                showError();
                throw new Error('Network response was not ok');
            }
            const data = await res.json();
            setBulkRequestBatchId(data);
            setShowBulkDataTable(false);
            setLoading(false);
            // showSuccess();

        } catch (error) {
            setBulkRequestBatchId(false);
            setShowBulkDataTable(true);
            showError();
            setLoading(false);
        }
    };

    const [requestStatusData, setRequestStatusData] = useState([]);
    const [batchData, setBatchData] = useState([]);

    const bearerToken = sessionStorage.getItem("authToken");
    const authHeader = `Bearer ${bearerToken}`;


    const batchRowClick = async (item) => {
        try {
            const res = await fetch(`${API_BASE_URL}/services/mdm/company/match/download/request?batchId=${item.batchId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            setBatchData(data);

            // Define the order of headers as per your requirement
            const headerOrder = [
                "S.No", "Input Account Name", "Input Website", "Input Country", "Input Stock Ticker",
                "Input DUNS Number", "Input Mode", "Matched CMID", "Matched Account Name",
                "Matched Account Type", "Matched Surf ID", "Matched DUNS Number", "Matched MDM ID",
                "Matched Website", "Matched Stock Ticker", "Matched Address",
                "Matched City", "Matched State", "Matched Country", "Matched Create Date",
                "Matched Last Update Date", "Confidence Score", "Match Reason", "Rank based on ACV"
            ];

            // Define your pretty header name mapping
            const headerMapping = {
                "rankBasedOnACV": "Rank based on ACV",
                "inAccountNm": "Input Account Name",
                "inWebsite": "Input Website",
                "inCountry": "Input Country",
                "inStockTicker": "Input Stock Ticker",
                "inDunsNmbr": "Input DUNS Number",
                "inMode": "Input Mode",
                "outCmid": "Matched CMID",
                "outAccountName": "Matched Account Name",
                "outAccountType": "Matched Account Type",
                "outSurfId": "Matched Surf ID",
                "outDunsNmbr": "Matched DUNS Number",
                "outMdmId": "Matched MDM ID",
                "outWebsite": "Matched Website",
                "outStockTicker": "Matched Stock Ticker",
                "outAddr": "Matched Address",
                "outCity": "Matched City",
                "outState": "Matched State",
                "outCountry": "Matched Country",
                "outCreateDate": "Matched Create Date",
                "outLastUpdateDate": "Matched Last Update Date",
                "outMatchScore": "Confidence Score",
                "outMatchReason": "Match Reason",

            };

            // Map the original JSON keys to the pretty header names, maintaining the header order
            const transformedData = data.map((item, index) => {
                const transformedItem = { "S.No": String(index + 1) };
                // Iterate over the header order array to map fields to the correct header names
                headerOrder.forEach(header => {
                    // Find the internal field name that matches the header
                    for (const key in headerMapping) {
                        if (headerMapping[key] === header) {
                            transformedItem[header] = item[key] || "";  // Map to value, use blank if undefined/null
                        }
                    }
                });
                return transformedItem;
            });

            // Convert the transformed data to a worksheet, ensuring the header order
            const worksheet = XLSX.utils.json_to_sheet(transformedData, { header: headerOrder });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

            // Generate Excel file and trigger download
            XLSX.writeFile(workbook, item.fileName + '.xlsx');

        } catch (error) {
            console.error('Error fetching request status:', error);
        }
    };


    const fetchRequestStatus = async () => {
        try {
            setLoading(true);
            const bearerToken = sessionStorage.getItem("authToken");
            const authHeader = `Bearer ${bearerToken}`;

            const res = await fetch(`${API_BASE_URL}/services/mdm/company/match/upload/requests?email=` + sessionStorage.getItem('loginUserEmail'), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authHeader,
                },
            });

            if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            setRequestStatusData(data); // Assuming you have a state to hold this data
            setLoading(false);
        } catch (error) {

            console.error('Error fetching request status:', error);
            setLoading(false);
        }
    };

    const handleTabClick = (tab) => {
        setIsDisabled(false);
        setBulkRequestBatchId(false);
        if (tab === 'request_status') {
            setActiveTab('request_status');
            document.body.style.overflow = 'auto'; // Hide scrolling
            fetchRequestStatus();
        } else {
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
        // Handle other tabs if necessary
    };


    // const downloadTemplate = () => {
    //     setIsDisabled(false);
    //     const templateData = [{
    //         accountname: "test",
    //         country: "US",
    //         website: "test@aaa.com",
    //         stockticker: "DXC",
    //         mode: "single"

    //     }];
    //     const worksheet = XLSX.utils.json_to_sheet(templateData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    //     XLSX.writeFile(workbook, 'BulkMatchAccountTemplate.xlsx');
    // };



    const downloadTemplate = () => {
        // Template data with default value for mode
        const templateData = [{
            accountname: "test",
            country: "US",
            website: "test@aaa.com",
            dunsnumber: "080521853",
            stockticker: "DXC",

        }];

        // Convert JSON data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(templateData);

        // Data validation rule for 'mode' column (assuming column E, range E2:E100)
        const validation = {
            sqref: 'E2:E100',  // Apply to E2:E100 (mode column)
            type: 'list',      // Dropdown list type
            formula1: '"single,multi"',  // Options for the dropdown (only "single" or "multi")
            showDropDown: true,  // Show the dropdown arrow in Excel
            allowBlank: false,   // Prevent blank or invalid input
        };

        // Add the validation to the worksheet
        if (!worksheet['!dataValidations']) worksheet['!dataValidations'] = [];
        worksheet['!dataValidations'].push(validation);

        // Apply strict validation to prevent typing other values
        const modeColumnRange = 'E2:E100';  // Adjust as per the required rows

        // Set strict validation by setting `allowBlank` to false and validating against 'single' and 'multi'
        if (!worksheet['!dataValidations']) worksheet['!dataValidations'] = [];
        worksheet['!dataValidations'].push({
            sqref: modeColumnRange,
            type: 'list',
            formula1: '"single,multi"',  // Only allow 'single' or 'multi'
            showDropDown: true,
            allowBlank: false,  // Don't allow blank values
        });

        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

        // Write the Excel file and trigger download
        XLSX.writeFile(workbook, 'BulkMatchAccountTemplate.xlsx');
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    useEffect(() => {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        setCurrentItems(bulkData.slice(start, end));
    }, [bulkData, currentPage]);


    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const formatDate = (dateString) => {
        return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
    };


    const RequestStatusTable = ({ data }) => {
        const [currentPage, setCurrentPage] = useState(0);
        const itemsPerPage = 10;

        const handlePageClick = (selectedPage) => {
            setCurrentPage(selectedPage.selected);
        };

        // Calculate the data to display based on the current page
        const displayedData = data.slice(
            currentPage * itemsPerPage,
            (currentPage + 1) * itemsPerPage
        );

        if (data.length === 0) {
            return (
                <div className="text-center mt-4">
                    <p>No Data Found</p>
                </div>
            );
        }

        return (
            <div>
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-light mt-1"
                        style={{ marginRight: "5px" }}
                        onClick={() => {
                            handleTabClick("request_status");
                        }}
                    >
                        <img
                            src={refresh}
                            style={{ width: "15px", marginRight: "5px" }}
                        />
                        Refresh
                    </button>
                </div>
                <div
                    style={{ maxHeight: "600px" }}
                    className="table-responsive-fixed-header table-container"
                >
                     {loading && (
                                <div className="loading-overlay">
                                    <div className="loading-spinner" />
                                </div>
                            )}
                    <div>
                        <table className="table contact_match_bulk_request_status_table">
                            <thead>
                                <tr className="fix_header">
                                    <th>Batch ID</th>
                                    {/* <th>User accountnm</th> */}
                                    <th>Status</th>
                                    <th>Create Date</th>
                                    <th>Response Time (Min)</th>
                                    <th>Filename</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedData.map((item) => (
                                    <tr key={item.batchId}>
                                        <td>{item.batchId}</td>
                                        {/* <td>{item.useraccountnm}</td> */}
                                        <td>
                                            <span
                                                style={{
                                                    color:
                                                        item.processedStatus === 0
                                                            ? "black"
                                                            : "green",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {item.processedStatus === 0
                                                    ? "Pending"
                                                    : "Complete"}
                                            </span>
                                        </td>
                                        <td>{formatDate(item.createDate)}</td>
                                        <td>{item?.minutesSinceLastUpdate || '0'}</td>
                                        <td>{item?.fileName || '-'}</td>
                                        <td>
                                            {item.processedStatus === 1 && (
                                                <button
                                                    onClick={() => {
                                                        batchRowClick(item);
                                                    }}
                                                    type="button"
                                                    id="btnDownloadMatch"
                                                    className="btn btn-sm btn-secondary"
                                                >
                                                    <svg
                                                        style={{
                                                            marginRight: "5px",
                                                        }}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-download"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"></path>
                                                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path>
                                                    </svg>
                                                    Download
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Pagination Component */}
                <div className="d-flex justify-content-end mb-2">
                    <ReactPaginate
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={Math.ceil(data.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div>
            </div>
        );
    };






    return (
        <div className='contact_match_form_container'>


            <ul style={{ marginLeft: '-11px' }} className="nav nav-tabs">
                <li className="nav-item">
                    <a className={`tab_one nav-link ${activeTab === 'single' ? 'active' : ''}`}
                        onClick={() => setActiveTab('single')}
                        style={{ cursor: 'pointer' }}>Account Match</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'bulk' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bulk')}
                        style={{ cursor: 'pointer' }}>Account Bulk Match</a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'request_status' ? 'active' : ''}`}
                        onClick={() => {
                            handleTabClick('request_status')
                        }}
                        style={{ cursor: 'pointer' }}>Account Bulk Request Status</a>
                </li>
            </ul>

            {activeTab === 'single' && (
                <div style={{ minHeight: '500px' }}>

                    <form onSubmit={handleSubmit} formNoValidate>
                        <div className='d-flex justify-content-center'>
                            {combinedErrorMessage &&
                                <div className="alert alert-danger" role="alert" style={{ 'margin': '5px 0px 0px 0px', 'padding': '9px', 'width': 'fit-content' }}>
                                    {combinedErrorMessage}
                                </div>
                            }
                        </div>
                        <div className="container py-3">
                            <div className="row gx-4 gy-4 align-items-stretch">
                                {/* Left Section */}
                                <div className="col-md-4 d-flex">
                                    <div className="card shadow-sm border-0 p-3 bg-light rounded w-100 h-100">
                                        <div className="mb-3 text-start">
                                            <label htmlFor="accountnm" className="form-label fw-semibold">Account Name</label>
                                            <input
                                                type="text"
                                                className={`form-control ${accountnmError ? 'is-invalid' : ''}`}
                                                id="accountnm"
                                                name="accountnm"
                                                value={formData.accountnm}
                                                onChange={handleChange}
                                            />
                                            {accountnmError && <div className="invalid-feedback">{accountnmError}</div>}
                                        </div>

                                        <div className="text-start">
                                            <label htmlFor="mode" className="form-label fw-semibold">Match Mode</label>
                                            <AutoComplete
                                                value={formData.mode}
                                                suggestions={filteredmodes}
                                                completeMethod={searchmode}
                                                dropdown
                                                // Default dropdown icon (no filter icon)
                                                placeholder="Select Match Mode"
                                                className={`w-100 ${modeError ? 'is-invalid' : ''}`}
                                                field=""
                                                name="mode"
                                                onChange={handlemodeChange}
                                                onSelect={handlemodeSelect}
                                                onBlur={handleBlur}
                                                inputClassName="form-control"
                                                style={{ height: '60px' }}
                                            />
                                            {modeError && <div className="invalid-feedback">{modeError}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section */}
                                <div className="col-md-8 d-flex">
                                    <div className="card shadow-sm border-0 p-3 bg-light rounded w-100 h-100">
                                        <div className="row g-3 text-start">
                                            <div className="col-md-6">
                                                <label htmlFor="stockticker" className="form-label fw-semibold">Stock Ticker</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="stockticker"
                                                    name="stockticker"
                                                    value={formData.stockticker}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="website" className="form-label fw-semibold">Website Domain</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="website"
                                                    name="website"
                                                    value={formData.website}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="dunsnumber" className="form-label fw-semibold">DUNS Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="dunsnumber"
                                                    name="dunsnumber"
                                                    value={formData.dunsnumber}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="country" className="form-label fw-semibold">Country</label>
                                                <AutoComplete
                                                    value={inputValue}
                                                    suggestions={filteredCountries}
                                                    completeMethod={searchCountry}
                                                    dropdown
                                                    // ✅ Filter icon only for Country
                                                    dropdownIcon={() => <FilterIcon size={18} color="white" />}
                                                    placeholder="Select Country"
                                                    className={`w-100 ${countryError ? 'is-invalid' : ''}`}
                                                    field="name"
                                                    name="name"
                                                    onChange={handleCountryChange}
                                                    onSelect={handleCountrySelect}
                                                    onBlur={handleBlur}
                                                    itemTemplate={countryOptionTemplate}
                                                    inputClassName="form-control"
                                                    style={{ height: '60px' }}
                                                />
                                                {countryError && <div className="invalid-feedback">{countryError}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>







                        <div className='d-flex justify-content-center'>

                            <button type="submit" id="btnContactMatch" disabled={loading} className="btn btn-primary" >Submit</button>
                            {loading && (
                                <div className="loading-overlay">
                                    <div className="loading-spinner" />
                                </div>
                            )}

                            <button id="btnContactMatch" onClick={clearForm} style={{ marginLeft: '10px' }}>
                                Clear
                            </button>


                        </div>

                        <div className="d-flex justify-content-left relative overflow-hidden bg-yellow-50" style={{ minHeight: '80px', textAlign: 'left', marginLeft: '50px' }}>
                            <div className="absolute animate-marquee-small">
                                <div className="inline-block whitespace-nowrap text-left" > {/* font size reduced */}
                                    <div style={{ color: 'red' }}><strong>Please Note:</strong></div>
                                    <ol className="list-decimal pl-7" style={{ fontSize: '12px' }}>
                                        <li>Account Match will follow this order of search: Stock Ticker, DUNS Number, Website Domain, Account Name.</li>
                                        <li>Match Mode is only applicable for Account Name.</li>
                                        <li>Match Mode Definition:
                                            <ul className="list-disc pl-7" style={{ fontSize: '12px' }}>
                                                <li><strong>Probabilistic:</strong> High in Fuzzy</li>
                                                <li><strong>Median:</strong> Low in Fuzzy</li>
                                                <li><strong>Deterministic:</strong> Conservative Match</li>
                                                <li><strong>Primary:</strong> Best Single Match</li>
                                            </ul>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </div>

                        <div className='d-flex justify-content-center'>
                            {noResponse && !loading && !isError && (
                                <div className="no-response-message">
                                    No Response Received.
                                </div>
                            )}
                        </div>
                    </form>

                    {isError && <div className="alert alert-danger mt-2">An error occurred while fetching data.</div>}

                    {responseGenerated && Object.keys(responseData).length > 0 && (

                        <div className="mt-4">
                            <hr></hr>
                            <div className="card bg-light mb-3">
                                <div className="card-header">
                                    {responseGenerated && (
                                        <h3>
                                            Match Results
                                        </h3>
                                    )}

                                </div>
                                <div className="card-body" style={{ background: 'white' }}>
                                    <ul className="nav nav-tabs json_tab" role="tablist">
                                        <li className="nav-item">
                                            <div
                                                className={`first_tab ${dataFormateActiveTab === 'table' ? 'responce_formate_active_tab' : ''}`}
                                                onClick={() => setDataFormateActiveTab('table')}
                                                role="tab"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Table
                                            </div>
                                        </li>
                                        <li className="nav-item">
                                            <div
                                                className={` second_tab ${dataFormateActiveTab === 'json' ? 'responce_formate_active_tab' : ''}`}
                                                onClick={() => setDataFormateActiveTab('json')}
                                                role="tab"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                JSON
                                            </div>
                                        </li>
                                    </ul>
                                    {<div className="tab-content mt-2">


                                        {/* Table View for JSON Response */}
                                        {responseData && dataFormateActiveTab === 'table' && Array.isArray(responseData) && (
                                            <div
                                                style={{
                                                    textAlign: 'left',
                                                    maxHeight: '400px',
                                                    marginTop: '2%',
                                                    border: '1px solid #ddd',
                                                }}
                                            >
                                                <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                                                    <table
                                                        className="response-table"
                                                        style={{
                                                            width: '100%',
                                                            borderCollapse: 'collapse',
                                                            tableLayout: 'auto',
                                                        }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                {/* S.No column header */}
                                                                <th
                                                                    style={{
                                                                        fontWeight: 'bold',
                                                                        textAlign: 'left',
                                                                        padding: '8px',
                                                                        border: '1px solid #ddd',
                                                                        backgroundColor: '#f4f4f4',
                                                                        whiteSpace: 'nowrap',
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 2,
                                                                        boxSizing: 'border-box',
                                                                    }}
                                                                >
                                                                    S.No
                                                                </th>

                                                                {/* Other column headers with custom width support */}
                                                                {Object.entries(headerLabels).map(([key, { label, width }]) => (
                                                                    <th
                                                                        key={key}
                                                                        style={{
                                                                            fontWeight: 'bold',
                                                                            textAlign: 'left',
                                                                            padding: '8px',
                                                                            border: '1px solid #ddd',
                                                                            backgroundColor: '#f4f4f4',
                                                                            whiteSpace: 'nowrap',
                                                                            position: 'sticky',
                                                                            top: 0,
                                                                            zIndex: 2,
                                                                            boxSizing: 'border-box',
                                                                            width: width || 'auto',
                                                                            maxWidth: width || 'auto',
                                                                        }}
                                                                    >
                                                                        {label}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {responseData.map((item, index) => (
                                                                <tr key={index}>
                                                                    {/* S.No value */}
                                                                    <td
                                                                        style={{
                                                                            fontSize: 14,
                                                                            padding: '8px',
                                                                            border: '1px solid #ddd',
                                                                            textAlign: 'left',
                                                                            whiteSpace: 'nowrap',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            boxSizing: 'border-box',
                                                                        }}
                                                                    >
                                                                        {index + 1}
                                                                    </td>

                                                                    {/* Other field values */}
                                                                    {Object.entries(headerLabels).map(([key, { width }]) => (
                                                                        <td
                                                                            key={key}
                                                                            style={{
                                                                                fontSize: 14,
                                                                                padding: '8px',
                                                                                border: '1px solid #ddd',
                                                                                textAlign: 'left',
                                                                                whiteSpace: 'nowrap',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                boxSizing: 'border-box',
                                                                                width: width || 'auto',
                                                                                maxWidth: width || 'auto',
                                                                            }}
                                                                        >
                                                                            {key === 'confidenceScore'
                                                                                ? formatConfidenceScore(item[key])
                                                                                : item[key] ?? ''}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>





                                            </div>
                                        )}

                                        {/* JSON View */}
                                        {responseData && dataFormateActiveTab === 'json' && (
                                            <div
                                                className="tab-pane fade show active"
                                                style={{
                                                    maxHeight: '400px',
                                                    textAlign: 'left',
                                                    overflow: 'auto',
                                                    marginTop: '20px',
                                                    border: '1px solid #ddd',
                                                    backgroundColor: '#f9f9f9',
                                                }}
                                            >
                                                <pre>
                                                    {JSON.stringify(
                                                        responseData.map((item, index) => {
                                                            const { confidenceScore, websiteDomain, ...rest } = item;
                                                            return {
                                                                "S.No": index + 1,
                                                                ...rest,
                                                                confidenceScore: formatConfidenceScore(confidenceScore),
                                                            };
                                                        }),
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </div>
                                        )}


                                    </div>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'bulk' && (
                <div style={{ minHeight: '500px' }}>
                    <div className="bulk-match-container mt-4" style={{ height: 'calc(100vh - 261px)' }}>
                        <Toast ref={toast} />
                        <div >
                            <div className='row align-items-end g-3'>
                                <div className='col-md-4 d-flex justify-content-left' >
                                    <div className='d-flex justify-content-center flex-column'>

                                        <label for="file-upload" className="form-label">Select Excel File</label>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            accept=".xlsx, .xls"
                                            onChange={handleFileUpload}
                                            style={{ 'width': '400px', 'min-height': '34px' }}
                                            className='form-control'
                                        />
                                        {/* <label htmlFor="file-upload" className="btn btn-primary btn-large">
                                        Browse
                                    </label> */}
                                    </div>


                                    <div className="col-md-4 d-flex  justify-content-center" style={{ 'width': '400px', 'min-height': '20px' }}>

                                        <div >
                                            <label htmlFor="excel_mode" className="form-label">Match Mode</label>
                                            <select
                                                id="excel_mode"
                                                name="excel_mode"
                                                value={excelMode}
                                                onChange={(e) => setExcelMode(e.target.value)}
                                                className={`form-select ${modeError ? 'is-invalid' : ''}`}
                                            >
                                                <option value="probabilistic">Probabilistic</option>
                                                <option value="median">Median</option>
                                                <option value="deterministic">Deterministic</option>
                                                <option value="primary">Primary</option>

                                            </select>

                                        </div>
                                        {loading && (
                                <div className="loading-overlay">
                                    <div className="loading-spinner" />
                                </div>
                            )}
                                    </div>

                                    <div className='col-md-4 '>
                                        <div>
                                            <button className="btn btn-primary  btn-sm me-2" style={{ 'width': '300px', 'min-height': '30px', 'margin-top': '20%', 'margin-left': '30%' }} onClick={downloadTemplate}>
                                                Download Bulk Excel Upload Template
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {showBulkDataTable && bulkData.length > 0 ? (
                            <div>
                                <div className='d-flex'>
                                    <div style={{ width: '60%' }} className='d-flex justify-content-end'>

                                    </div>
                                    <div style={{ width: '40%' }} className="d-flex justify-content-end mb-3">
                                        <select
                                            value={selectedColumn}
                                            onChange={(e) => setSelectedColumn(e.target.value)}
                                            className="form-select me-2"
                                            style={{ width: "200px",height:"90%" }}
                                        >
                                            {columns.map((column) => (
                                                <option key={column.value} value={column.value}>
                                                    {column.label}
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search"
                                            className="form-control"
                                            style={{ width: "200px",height:"90%" }}
                                        />
                                    </div>

                                </div>

                                <div className="table-responsive-fixed-header table-container table_match" >
                                    <table className="table table-hover contact_match_table ">
                                        <thead>
                                            <tr>
                                                <th>Account Name</th>
                                                <th>Country</th>
                                                <th>Website</th>
                                                <th>DUNS Number</th>
                                                <th>Stock Ticker</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.accountname}</td>
                                                    <td>{item.country}</td>
                                                    <td>{item.website}</td>
                                                    <td>{item.dunsnmbr}</td>
                                                    <td>{item.stockticker}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className='row'>
                                    <div className='d-flex justify-content-end' >
                                        {/* <button id="btnSubmitMatch" className="btn btn-primary" onClick={sendBulkRequest} >
                                <svg   style={{
                                            'width':' 40%',
                                            'fill': 'red',
                                            'padding':'2%'
                                        }}         
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
                                    Submit
                                </button>  */}



                                        {/* <button type="submit" id="btnContactMatch"  className="btn btn-primary " onClick={sendBulkRequest} >Submit</button>  */}
                                        <button type="button" id="btnSubmitMatch" class="btn btn-primary" onClick={sendBulkRequest} disabled={isDisabled}>
                                            <svg style={{ marginRight: "5px", }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"></path>
                                                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"></path>
                                            </svg>
                                            {isDisabled ? "Submitting" : "Submit"}
                                        </button>

                                        <div className="col-auto ms-end d-flex justify-content-end mb-3 " style={{ "padding": "2%", "margin-left": "40%" }} >
                                            <ReactPaginate
                                                previousLabel={'Previous'}
                                                nextLabel={'Next'}
                                                breakLabel={'...'}
                                                pageCount={Math.ceil(bulkData.length / itemsPerPage)}
                                                marginPagesDisplayed={2}
                                                pageRangeDisplayed={5}
                                                onPageChange={handlePageClick}
                                                containerClassName={'pagination'}
                                                pageClassName={'page-item'}
                                                pageLinkClassName={'page-link'}
                                                previousClassName={'page-item'}
                                                previousLinkClassName={'page-link'}
                                                nextClassName={'page-item'}
                                                nextLinkClassName={'page-link'}
                                                breakClassName={'page-item'}
                                                breakLinkClassName={'page-link'}
                                                activeClassName={'active'}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>
                     ) : bulkRequestBatchId ? (
                            <div className="alert alert-success" role="alert">
                                <p>Bulk request success and processing started. <b>Batch ID: {bulkRequestBatchId?.batchId}</b></p>
                            </div>
                        ) : (
                            <p></p>
                        )}
                    </div></div>
            )}

            {activeTab === 'request_status' && (

                <div style={{ minHeight: '500px', "width": "100%" }}>
                    <RequestStatusTable data={requestStatusData} />


                </div>


            )}

        </div>
    );
};

export default MatchAccountForm;
