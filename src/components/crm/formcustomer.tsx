
export default function FormCustomer() {
  return (
    <Card className="col-span-2">
        <CardContent>
        <h3 className="font-semibold text-lg mb-4">Customer ID Form</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Customer ID No" placeholder="Enter Customer ID No" />
            <Input label="ID Date" type="date" />
            <Input label="Related CRM Ref. No" placeholder="Enter CRM Ref. No" />
            <Input label="Name of Customer" placeholder="Enter Name" />
            <Input label="Client Code" placeholder="Enter Client Code" />
            <Input label="System Consecutive No." placeholder="1000001" disabled />
            <Input label="Full Address of Customer" placeholder="Enter Address" />
            <Input label="Woreda" placeholder="Enter Woreda" />
            <Input label="Sub City" placeholder="Enter Sub City" />
            <Input label="Kebele" placeholder="Enter Kebele" />
            <Input label="E-mail Address" type="email" placeholder="Enter E-mail" />
            <Input label="Fixed Tele Line No" placeholder="Enter Tele Line No" />
            <Input label="Mobile Phone No." placeholder="Enter Mobile No." />
            <Input label="Location No." placeholder="Enter Location No." />
            <Input label="Head of the Company" placeholder="Enter Name" />
            <Input label="Owner of the Company if different" placeholder="Enter Name" />
            <Input label="Representative Name" placeholder="Enter Name" />
            <Input label="Rep Mobile No." placeholder="Enter Mobile No." />
            <Input label="Customers Specialization" placeholder="Enter Specialization" />
            <h3 className="col-span-2 font-semibold text-lg mt-4">Recording Commercial Personnel</h3>
            <Input label="Name" placeholder="Enter Name" />
            <Input label="Customer ID" placeholder="Enter Customer ID" />
            <Input label="PGL" placeholder="Enter PGL" />
            <Input label="Client Code" placeholder="Enter Client Code" />
            <Input label="Consecutive No." placeholder="DDMMYY" />
            <Button type="submit" className="col-span-2 w-full bg-orange-500 text-white">Submit</Button>
        </form>
        </CardContent>
  </Card>
  );
};

function Card({ children, className }) {
    return <div className={`bg-white shadow rounded-lg p-4 ${className}`}>{children}</div>;
}
    
function CardContent({ children }) {
    return <div className="p-4">{children}</div>;
}

function Select({ label, options = [], className = "", ...props }) {
    return (
        <div className="flex flex-col">
            {label && <label className="text-sm font-medium mb-1">{label}</label>}
            <select
                className={`p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${className}`}
                {...props}
            >
                {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
        </div>
    );
}

function Input({ label, type = "text", placeholder, className = "", ...props }) {
    return (
        <div className="flex flex-col">
        {label && <label className="text-sm font-medium mb-1">{label}</label>}
        <input
            type={type}
            placeholder={placeholder}
            className={`p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none ${className}`}
            {...props}
        />
        </div>
    );
}
  
function Button({ type = "button", className = "", children, ...props }) {
    return (
        <button
            type={type}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${className} bg-orange-500 hover:bg-orange-600 text-white`}
            {...props}
            >
            {children}
        </button>
    );
}
  