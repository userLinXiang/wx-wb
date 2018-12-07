const express=require('express');
const bodyParser=require('body-parser')
const pool=require('./pool')
const cors=require("cors")
const app=express();
const session = require("express-session");
app.listen(3000)


app.use(express.static('src'))
app.use(express.static(__dirname+'/public'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors({
    origin:["http://localhost:3001","http://127.0.0.1:3001","http://localhost:4200"],
    credentials:true
}))

app.use(session({
    secret:'随机字符串',
    cookie:{maxAge:60*1000*30},//过期时间ms
    resave:false,
    saveUninitialized:true
  }));



  //轮播图 2
  app.get("/imagelist",(req,res)=>{
      var output=[{
          img:"img/lunbo/lunbo5.jpg",id:1
      },{
        img:"img/lunbo/lunbo6.jpg",id:2
    },{
        img:"img/lunbo/lunbo7.jpg",id:3
    },{
        img:"img/lunbo/lunbo8.jpg",id:4
    }];
    res.send(output);
  })

  //小图片
  app.get("/smallImagelist",(req,res)=>{
      var output=[
        { img: "img/smallImage/boy.jpg", id: 1, title: "男表" },
        { img: "img/smallImage/girl.jpg", id: 2, title: "女表" },
        { img: "img/smallImage/student.jpg", id: 3, title: "学生" },
        { img: "img/smallImage/laolishi.jpg", id: 4, title: "劳力士" },
        { img: "img/smallImage/amani.jpg", id: 5, title: "阿玛尼" },
        { img: "img/smallImage/zixun.jpg", id: 6, title: "天梭" }
      ];
      res.send(output)
  })

  //新闻信息
  app.get("/getNews",(req,res)=>{
      var output=[
          {ctime:"2018-11-20",img_url:"img/banner1.png",title:"电脑真便宜1",desc:"好便宜的电脑啊1"},
          {ctime:"2018-11-21",img_url:"img/banner2.png",title:"电脑真便宜2",desc:"好便宜的电脑啊2"},
          {ctime:"2018-11-22",img_url:"img/banner3.png",title:"电脑真便宜3",desc:"好便宜的电脑啊3"},
      ];
      res.send(output);
  })

  //wb-class
  app.get('/wbClass',(req,res)=>{
      var output=[
          {title:"商务男士",subtitle:"BUSSONESS",img_url:"img/wb-class/business.jpg",id:1},
          {title:"优雅女士",subtitle:"WOMAN",img_url:"img/wb-class/woman.jpg",id:2},
          {title:"机械腕表",subtitle:"MECHANICA",img_url:"img/wb-class/mechanica.jpg",id:3},
          {title:"石英腕表",subtitle:"BUSSONESS",img_url:"img/wb-class/quartz.jpg",id:4}
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
    var uid=req.session.uid;
    console.log(uid);
    if(uid==undefined){
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
//创建登录路由
app.post('/signin',(req,res)=>{
    var uname=req.body.uname;
    var upwd=req.body.upwd;
    var sql="select * from wb_user where uname=? and upwd=?";
    pool.query(sql,[uname,upwd],(err,result)=>{
        if(err) console.log(err)
        if(result.length>0){
        res.writeHead(200,{
            "Content-Type":"application/json;charset=utf-8",
            "Access-Control-Allow-Origin":"*"
        });
        var user=result[0];
        console.log(user);
        req.session.uid=user.uid;
        console.log(req.session.uid);
        res.write(JSON.stringify({
          ok:1,uname:user.uname,uid:user.uid
        }))
      }else{
        res.write(JSON.stringify({
          ok:0,
          msg:"用户名或密码错误！"
        }))
      }
      res.end();
    })
})
//创建注销路由
app.get("/signout",(req,res)=>{
    delete req.session.uid;
    console.log(req.session.uid);
    res.send();
})

// 创建获取详情页商品信息接口

app.get('/getDetails',(req,res)=>{
    var id=req.query.lid;
    var sql="select * from wb_details where id=?";
    var output={};
    pool.query(sql,[id],(err,result)=>{
        if(err) console.log(err);
        output.product=result;
        var sql='select family_id from wb_product_details where lid=?';
        pool.query(sql,[id],(err,result)=>{
            if(err) console.log(err);
            //console.log(result[0].family_id);
            var fid=result[0].family_id;
            var sql='select spec,sm_pic,lid from wb_product_details where family_id=?';
            return pool.query(sql,[fid],(err,result)=>{
                if(err) console.log(err)
                //console.log(result);
                if(result[0].spec!="")
                    output.spec=result;
                    res.send(JSON.stringify(output));
            })
        })
        
    })
})

// 创建购物车路由 2个sql语句 第1个通过lid 去wb_product_details拿数据
//第二个 通过拿过来的数据中的可用值加入到数据库wb_shopcart中
app.get('/joinCart',(req,res)=>{
    var lid=req.query.lid;
    var uid=req.query.uid;
    var count=req.query.count;
    console.log("lid:"+lid+" "+"uid:"+uid+" "+"count:"+' '+count);
    var sql='select * from wb_shopcart where uid=?';
    pool.query(sql,[uid],(err,result)=>{
        if(err) console.log(err);
        //res.send(result);
        if(result.length>0){
            var sql="select * from wb_shopcart where pid=? and uid=?";
            pool.query(sql,[lid,uid],(err,result)=>{
                if(err) console.log(err);
                if(result.length>0){
                    var sql='update wb_shopcart set count=count+? where pid=?';
                    pool.query(sql,[count,lid],(err,result)=>{
                        if(err) console.log(err)
                        if(result.affectedRows>0){
                            res.send(JSON.stringify({code:1,msg:"添加成功"}))
                        }else{
                            res.send(JSON.stringify({code:0,msg:"添加失败"}))
                        }
                    })
                }else{
                    var sql='select price,title,d_img from wb_product_details where lid=?';
                    pool.query(sql,[lid],(err,result)=>{
                        if(err) console.log(err)
                        var price=result[0].price;
                        var title=result[0].title;
                        var pic=result[0].d_img;
                        var sql='insert into wb_shopcart values(null,?,?,?,?,false,?,?)';
                        pool.query(sql,[price,pic,title,count,lid,uid],(err,result)=>{
                            if(err) console.log(err);
                            if(result.affectedRows>0){
                                res.send(JSON.stringify({code:300,msg:"添加成功"}))
                            }else{
                                res.send(JSON.stringify({code:301,msg:"添加失败"}))
                            }
                        })
                    })
                }
            })
        }else{
            var sql='select price,title,d_img from wb_product_details where lid=?';
            pool.query(sql,[lid],(err,result)=>{
                if(err) console.log(err)
                var price=result[0].price;
                var pic=result[0].d_img;
                var title=result[0].title;
                var sql='insert into wb_shopcart values(null,?,?,?,?,false,?,?)';
                pool.query(sql,[price,pic,title,count,lid,uid],(err,result)=>{
                    if(err) console.log(errr)
                    if(result.affectedRows>0){
                        res.send(JSON.stringify({code:200,msg:"添加成功"}))
                    }else{
                        res.send(JSON.stringify({code:201,msg:"添加失败"}))
                    }
                })
            })
        }
    })
})

// 获取购物车用户uid所有商品信息

app.get('/getCart',(req,res)=>{
    var uid=req.query.uid;
    var sql='select * from wb_shopcart where uid=?';
    pool.query(sql,[uid],(err,result)=>{
        if(err) console.log(err);
        res.send(result);
    })
})

//删除商品接口

app.get('/delete',(req,res)=>{
    var lid=req.query.lid;
    var uid=req.query.uid;
    var sql='delete from wb_shopcart where pid=? and uid=?';
    pool.query(sql,[lid,uid],(err,result)=>{
        if(err) console.log(err)
        if(result.affectedRows>0){
            res.send(JSON.stringify({code:305,msg:"删除成功"}))
        }else{
            res.send(JSON.stringify({code:306,msg:"删除失败"}))
        }
    })

})