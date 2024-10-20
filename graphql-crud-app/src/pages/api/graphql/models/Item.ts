import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
