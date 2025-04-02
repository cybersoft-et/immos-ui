import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Input, Select,  Dialog, DialogTrigger, DialogContent, Textarea, Progress, DialogTitle } from "./ui/index";
import axios from "axios";

const FormDocumentUpload = ({onUploadComplete}) => {
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    DocumentTypeId: "",
    DocumentType: "",
    Content: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, Content: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('#Upload Form Data:', formData);
    if (!formData.Content) return;

    const uploadData = new FormData();
    uploadData.append("Name", formData.Name);
    uploadData.append("Description", formData.Description);
    uploadData.append("DocumentTypeId", formData.DocumentTypeId);
    uploadData.append("DocumentType", '8');
    uploadData.append("Content", formData.Content, formData.Content.name);

    try {
      const response = await axios.post("https://localhost:8000/api/documents", uploadData, {
        headers: { "Content-Type": "multipart/form-data", "accept": "*/*" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setDocuments([...documents, response.data]);
    
      setUploadProgress(0);
      onUploadComplete(response.data.id);

      console.log('#Document uploaded successfully :', response.data);
      console.log('#Document Id: ', response.data.id);

      // close dialog
      setOpen(false);

    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:8000/api/documents/${id}`);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const columns = [
    { headerName: "Name", field: "name", width: 100 },
    { headerName: "Description", field: "description", width: 200 },
    { headerName: "Size", field: "size", width: 100 },
    {
      headerName: "Actions",
      field: "id",
      cellRendererFramework: (params) => (
        <div className="flex space-x-2">
          <Button className="bg-blue-500 text-white mr-3" onClick={() => window.open(`/uploads/${params.data.documentPath}`, "_blank")}>
            View
          </Button>
          <Button className="bg-blue-500 text-white mr-3" variant="destructive" onClick={() => handleDelete(params.data.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        </DialogTrigger>
        <DialogContent>
        <DialogTitle>Document Upload Form: </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="Name" placeholder="Name" value={formData.Name} onChange={handleChange} required />
            <Textarea name="Description" placeholder="Description" value={formData.Description} onChange={handleChange} required />
            <Input name="DocumentTypeId" placeholder="Document Type ID" value={formData.DocumentTypeId} onChange={handleChange} required />
            <Select name="DocumentType" value={formData.DocumentType} onChange={handleChange} 
              options={[
                { label: "PDF", categoryName: "8" },
                { label: "DOC", categoryName: "2" },
                { label: "TXT", categoryName: "3" },   ]} required>

              <option categoryName="8" value="8">PDF</option>
              <option categoryName="2" value="2">Docs.</option>
              <option categoryName="3" value="3">Text</option>          
                           
            </Select>
            <Input type="file" onChange={handleFileChange} required />
            {uploadProgress > 0 && <Progress value={uploadProgress} />}
            {/* <Button className="bg-blue-500 text-white mr-3" type="button">Upload</Button> */}
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50 mr-3"
            >
              Upload
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-700 text-white mr-3" onClick={() => setOpen(false)} variant="secondary">Cancel</Button>
            
          </form>
        </DialogContent>
      </Dialog>
      <div className="ag-theme-alpine w-fit m-2 w-[400px] "  >
        <Button className="bg-blue-500  text-white " onClick={() => setOpen(true)}>Upload Document</Button>
          <AgGridReact
            rowData={documents} 
            columnDefs={columns}
            domLayout='autoHeight'
            suppressSizeToFit={true}
            pagination={false} />
      </div>
    </div>
  );
};

export default FormDocumentUpload;
