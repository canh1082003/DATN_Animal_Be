import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String }, // training, behavior, news, etc.
    tags: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String }],
  },
  { timestamps: true, collection: 'articles' }
);

const Article = mongoose.model('Article', ArticleSchema);
export default Article;
