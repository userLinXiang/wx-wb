const express=require('express');
const bodyParser=require('body-parser')
const pool=require('./pool')
const cors=require("cors")
const app=express();

app.listen(3000)


app.use(express.static('src'))
app.use(express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors({
    origin:["http://localhost:3001","http://127.0.0.1:3001","http://localhost:4200"],
    credentials:true
}))





  //轮播图 2
  app.get("/imagelist",(req,res)=>{
      var output=[{
          img:"http://176.51.1.241:3000/img/lunbo/lunbo5.jpg",id:1
      },{
        img:"http://176.51.1.241:3000/img/lunbo/lunbo6.jpg",id:2
    },{
        img:"http://176.51.1.241:3000/img/lunbo/lunbo7.jpg",id:3
    },{
        img:"http://176.51.1.241:3000/img/lunbo/lunbo8.jpg",id:4
    }];
    res.send(output);
  })

  //小图片
  app.get("/smallImagelist",(req,res)=>{
      var output=[
        { img: "http://176.51.1.241:3000/img/smallImage/boy.jpg", id: 1, title: "男表" },
        { img: "http://176.51.1.241:3000/img/smallImage/girl.jpg", id: 2, title: "女表" },
        { img: "http://176.51.1.241:3000/img/smallImage/student.jpg", id: 3, title: "学生" },
        { img: "http://176.51.1.241:3000/img/smallImage/laolishi.jpg", id: 4, title: "劳力士" },
        { img: "http://176.51.1.241:3000/img/smallImage/amani.jpg", id: 5, title: "阿玛尼" },
        { img: "http://176.51.1.241:3000/img/smallImage/zixun.jpg", id: 6, title: "资讯" }
      ];
      res.send(output)
  })

  //新闻信息
  app.get("/getNews",(req,res)=>{
      var output=[
          {ctime:"2018-11-20",img_url:"http://176.51.1.241:3000/img/banner1.png",title:"电脑真便宜1",desc:"好便宜的电脑啊1"},
          {ctime:"2018-11-21",img_url:"http://176.51.1.241:3000/img/banner2.png",title:"电脑真便宜2",desc:"好便宜的电脑啊2"},
          {ctime:"2018-11-22",img_url:"http://176.51.1.241:3000/img/banner3.png",title:"电脑真便宜3",desc:"好便宜的电脑啊3"},
      ];
      res.send(output);
  })

  //wb-class
  app.get('/wbClass',(req,res)=>{
      var output=[
          {title:"商务男士",subtitle:"BUSSONESS",img_url:"http://176.51.1.241:3000/img/wb-class/business.jpg",id:1},
          {title:"优雅女士",subtitle:"WOMAN",img_url:"http://176.51.1.241:3000/img/wb-class/woman.jpg",id:2},
          {title:"机械腕表",subtitle:"MECHANICA",img_url:"http://176.51.1.241:3000/img/wb-class/mechanica.jpg",id:3},
          {title:"石英腕表",subtitle:"BUSSONESS",img_url:"http://176.51.1.241:3000/img/wb-class/quartz.jpg",id:4}
      ];
      res.send(output);
  })
  
  //wb-product
//创建获取数据库product_details库中的数据
app.get("/getProduct",(req,res)=>{
    var kw=req.query.kw;
    if(kw!=undefined){
    var output={
        count:0,
        pageSize:12,
        pageCount:0,
        pno:req.query.pno,
        data:[]
    };
    console.log(kw);
    // var kws=kw.split(" ");//[男表 劳力士 ...]
    // //通过遍历kws中的关键词 来设置模糊查询
    // kws.forEach((elem,i,arr)=>{
    //     arr[i]=`subtitle like '%${elem}%'`
    // })
    // var where=kws.join(" and ");
    //subtitle like '%男表%' and '%劳力士%'...
    var sql=`select * from wb_product_details where subtitle like '%${kw}%'`;
    pool.query(sql,[],(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        output.count=result.length;
        output.pageCount=Math.ceil(output.count/output.pageSize);
        output.data=result;
        sql+=` limit ?,?`;
        return pool.query(sql,[output.pageSize*output.pno,output.pageSize],(err,result)=>{
            if(err) console.log(err);
            output.data=result;
            res.send(output); 
        })
    })
}else{
    var sql=`select * from wb_product_details`;
    pool.query(sql,[],(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.send(result);
    })
}   
}) 
//创建是否登录路由  用来判断是否已登录
app.get('/islogin',(req,res)=>{
    //1.设置响应头
    //2.判断session_id 是否为空 为空则未登录 不为空则通过session_id=uid 从数据库拿出
    var uid=req.session.uid
    if(uid==null){
      res.write(JSON.stringify({ok:0}));
      res.end();
    }else{
      var sql="select * from wb_user where uid=?";
      pool.query(sql,[uid],(err,result)=>{
        if(err) console.log(err);
        res.write(JSON.stringify({ok:1,uname:result[0].uname}));
        res.end();
      })
    }
})