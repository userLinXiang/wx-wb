app.get('/joinCart',(req,res)=>{
    var lid=req.query.lid;
    var count=req.query.count;
    var uid=req.query.uid;
    var sql="select * from wb_shopcart where uid=?";
    pool.query(sql,[uid],(err,result)=>{
        if(err) console.log(err);
        if(result.length>0){
            var sql='select * from wb_shopcart where pid=?';
            pool.query(sql,[lid],(err,result)=>{
                if(err) console.log(err);
                if(result.length>0){
                    var sql='update wb_shopcart set count=count+? where pid=?';
                    pool.query(sql,[count,lid],(err,result)=>{
                        if(err) console.log(err);
                        if(result.affectedRows>0){
                            res.send(JSON.stringify({ok:1,msg:"添加成功"}))
                        }else{
                            res.send(JSON.stringify({ok:0,msg:'添加失败'}))
                        }
            })
        }else{
            var sql='select price,title,d_img from wb_product_details where lid=?';
        pool.query(sql,[lid],(err,result)=>{
        if(err) console.log(err);
        //res.send(result);
        var price=result[0].price;
        var title=result[0].title;
        var pic=result[0].d_img;
        var sql='insert into wb_shopcart values(null,?,?,?,?,false,?,?)'
        pool.query(sql,[price,pic,title,count,lid,uid],(err,result)=>{
            if(err) console.log(err);
            //console.log(result);
            if(result.affectedRows>0){
                res.send(JSON.stringify({ok:1,msg:"添加成功"}))
            }else{
                res.send(JSON.stringify({ok:0,msg:'添加失败'}))
            }
        })
    })
        }
        })     
        }else{
        var sql='select price,title,d_img from wb_product_details where lid=?';
        pool.query(sql,[lid],(err,result)=>{
        if(err) console.log(err);
        //res.send(result);
        var price=result[0].price;
        var title=result[0].title;
        var pic=result[0].d_img;
        var sql='insert into wb_shopcart values(null,?,?,?,?,false,?,?)'
        pool.query(sql,[price,pic,title,count,lid,uid],(err,result)=>{
            if(err) console.log(err);
            //console.log(result);
            if(result.affectedRows>0){
                res.send(JSON.stringify({ok:1,msg:"添加成功"}))
            }else{
                res.send(JSON.stringify({ok:0,msg:'添加失败'}))
            }
        })
    })
        }
    }) 
})