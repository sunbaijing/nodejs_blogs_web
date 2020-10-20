const express=require('express');
const morgan =require('morgan');

const mongoose=require('mongoose');
const Blog=require('./models/blog')

const app=express();
const dbURI='mongodb+srv://baijing:test1234@node-tuts.6ylkn.mongodb.net/node-tuts?retryWrites=true&w=majority';

mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true}).
then((result)=>{app.listen(3000)}).catch(err=>{console.log(err)})
app.set('view engine','ejs');

 app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}))
 

app.get('/add-blog',(req,res)=>{
    const blog=new Blog({
        title:'new blog',
        snippet:'about my new blog',
        body:'more about mynew blog'
    });

    blog.save()
    .then((result)=>{
        res.send(result)
    }).catch(err=>{console.log(err)})
})

app.get('/all-blogs',(req,res)=>{
    Blog.find()
    .then(result=>{
        res.send(result);
    }).catch(err=>{
        console.log(err)
    })
})

app.get('/single-blog',(req,res)=>{
    Blog.findById('5f84e9d16b70ab071c6d20a1')
    .then((result)=>{
         res.send(result)
    }).catch(err=>{
        console.log(err)
    })
})

app.get('/',(req,res)=>{
    res.redirect('/blogs')
})

app.get('/blogs',(req,res)=>{
    Blog.find()
    .then((result)=>{
       
      res.render('index',{title:'All Blogs',blogs:result})
    }).catch(err=>{
        console.log(err)
    })
})


app.get('/about',(req,res)=>{
    res.render('about',{title:'About'})
})

app.post('/blogs',(req,res)=>{
    const blog=new Blog(req.body);
    blog.save()
    .then((result)=>{
        res.redirect('/blogs')
    })
    .catch(err=>{console.log(err)})
})

app.get('/blogs/create',(req,res)=>{
    res.render('create',{title:'create-blog'})
})

app.get('/blogs/:id',(req,res)=>{
    const id=req.params.id;
    Blog.findById(id).
    then(result=>{
        res.render('details',{
            title:'blog details',
            blog:result})
    }).catch(err=>{
        console.log(err)
    })
})
app.delete('/blogs/:id',(req,res)=>{
    const id=req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result=>{
        res.json({redirect:'/blogs'})
    })
    .catch(err=>{console.log(err)})
})

app.use((req,res)=>{
    res.status(404).render('404',{title:'404'})
})