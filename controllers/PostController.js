import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't get tags",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: "user", select: ["fullName", "avatarUrl"] }) // allows you to explicitly specify which fields you want to select from the associated user model, excluding passwordHash
      .exec(); //In Mongoose, the exec() method is used to execute database queries
    //'Connecting communications' when receiving documents. In Model I did it through 'type: mongoose.Schema.Types.ObjectId'
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't get all the articles",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; //I'm taking out a dynamic parameter. The article id.

    PostModel.findOneAndUpdate(
      //mongoose method
      {
        _id: postId, //1 param - find article by id
      },
      {
        $inc: { viewsCount: 1 }, //2 param - what I want update
      },
      {
        returnDocument: "after", //3 param - return an updated result
      }
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Article not found",
          });
        }

        res.json(doc);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Error return article",
          });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in getting selected article",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Article not found",
          });
        }

        res.json({ success: true });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Failed to delete an article",
          });
        }
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in getting selected article",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.title,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId, //userId get when do an authorization check
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to create an article",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      } //what I want update
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update an article",
    });
  }
};
