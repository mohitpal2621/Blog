const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

main().catch(err => console.log(err));

async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

  const postSchema = new mongoose.Schema({
    title: String,
    content: String
  });

  const Post = mongoose.model('Post', postSchema);

  app.get("/", async function(request, response){
    const posts = await Post.find({});

    response.render("home", {
        Content: homeStartingContent,
        postList: posts
      }
    );
  });

  app.get("/compose", function(request, response){
    response.render("compose");
  });

  app.post("/compose", async function(req, res){
    
    // const exisPost = posts.find(p => p.title.toLowerCase() === post.title.toLowerCase());
    const exisPost = await Post.findOne({title: req.body.postTitle});
    
    if(exisPost){
      res.render("compose", {
        error: "A post with the same title already exists. Please enter a different title."
      });
    } else{
      const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
      });
  
      await post.save().then(() => {
        res.redirect('/');
      }).catch(err => {
        res.status(400).send("Unable to save post to database.");
      });

    }
  });

  app.get("/post/:postId", async function(req, res) {
    const rqstId = req.params.postId;

    const postFound = await Post.findById(rqstId);

    res.render("post", {
      titlePost: postFound.title,
      contentPost: postFound.content,
      id: postFound._id 
    });
    
  });

  app.post("/delete", async function(req,res){

    const idDelete= req.body.button;
    
    await Post.findByIdAndRemove(idDelete);
    
    res.redirect("/");
  });

  app.get("/about", function(request, response){
    response.render("about", {
      about: aboutContent
    });
  });

  app.get("/contact", function(request, response){
    response.render("contact", {
      contact: contactContent
    });
  });

  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });

}