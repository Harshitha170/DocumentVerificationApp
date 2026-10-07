import mongoose, {Schema} from 'mongoose';


const documentSchema = new Schema({
   userId: {
     type: Schema.Types.ObjectId,
     ref: "User",
     required: true
   },
   docType: {
    type: String,
    required: true,
    enum: ['Aadhar', 'Pan', 'DL']
   },
   fileUrl: {
    type: String,
    required: true
   },
   cloudinaryPublicId: {
    type: String,
    required: true
   },
   status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    required: true,
    default: 'Pending'
   },
   rejectedReason: {
    type: String,
    default: ''
   },
   submittedAt: {
    type: Date,
    required: true,
    default: Date.now
   }

}, {timestamps: true});



export const Document = mongoose.model("Document", documentSchema);


