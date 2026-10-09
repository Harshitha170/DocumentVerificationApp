import { Document } from "../models/document.model.js";


const getPendingDocuments = async(req, res) => {
    try {
     const pendingDocuments =  await Document.find({
            status: "Pending"
        })
        .populate("userId", "customId userName email mobile");

        return res
        .status(200)
        .json
        ({message: "Pending documents fetched successfully",
            count: pendingDocuments.length,
            documents: pendingDocuments
        })
    } catch (error) {
        return res
        .status(500)
        .json({
            message: "Internal server error.",
            error: error.message
        });
    }
}


const updateDocumentStatus = (async (req, res) => {
    try {
        const {documentId} = req.params;
        const { status, adminRemarks } = req.body; //status should be approved or rejected

         //to validate the status is valid
         if(!['Approved' ,'Rejected'].includes(status)){
            return res
            .status(400)
            .json({
                message: "Invalid status. Must be either 'Approved' or 'Rejected'."
            });
         }


         const updatedDocument = await Document.findByIdAndUpdate(
            documentId,
            {
                status,
                adminRemarks: adminRemarks || "",
                reviewedAt: Date.now()
            },
            {new: true} // will return newly updated doc
         );


         if(!updatedDocument){
            return res
            .status(404)
            .json({
                message: "Document not found"
            })
        }
            return res
            .status(200)
            .json({message: `Document has been ${status.toLowerCase()} successfully.`,
            document: updatedDocument
         });


    } catch (error) {
        return res
        .status(500)
        .json(
            {
                message: "Internal server error",
                error: error.message
    });
    }
})



export {getPendingDocuments,
    updateDocumentStatus
}