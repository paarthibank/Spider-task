var exp=require("express");
var mysql=require("mysql");
var session=require("express-session");
var bodyparser=require("body-parser");
var multer=require("multer");
var i=0;
var j=0;
s=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
p=["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"];
var l,p,q=0,r,s,t,u;
var ii=0,det=[],adv=[],pro=[],i=0,com=[],n=0,cart=[],na,addr,ur,naa,fg=0;
con=exp();
con.use(bodyparser.json());
con.use(bodyparser.urlencoded({extended: true}));
con.use(exp.static("public"));
con.use(session({
	secret:'secret',
	resave: true,
	saveUninitialized: true

}))
var sql=mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Arizona"
})
sql.connect(function(err) {
  if (err) {
  	console.log(err);
  }
  console.log("Connected!");
});
con.get("/",function(req,res){
	res.render("myweb.ejs");
	res.end();
})
con.post("/det",function(req,res){
	res.render("initiali.ejs");
	res.end();
})

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public')
  },
  filename: function (req, file, cb) {
     cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
sql.query("CREATE DATABASE IF NOT EXISTS web");
sql.query("USE web");
con.post("/reg",upload.single("pro"),function(req,res){
	var a1,a2,a3,a4;
	a1=req.body.name;
	na=a1;
	a2=req.body.cono;
	a3=req.body.details;
	a4=req.file.originalname;
	sql.query("CREATE TABLE IF NOT EXISTS myref(Name varchar(50) not null, Details varchar(1000) not null, Contact_no varchar(10) not null,Pic varchar(50))");
	sql.query("INSERT INTO myref(Name,Details,Contact_no,Pic) VALUES (?,?,?,?)",[a1,a3,a2,a4],function(err,res,fields){if(err) throw err});

	res.render("sample1.ejs");

	res.end();
})
con.post("/details",upload.single("pro"),function(req,res){
	var logo=req.file.originalname;
	var org=req.body.organization;
	u=org;
	var pro=req.body.prono;
	var adv=req.body.advno;
	i=adv;
	j=pro;
	var tag=req.body.tagline;
	sql.query("CREATE TABLE IF NOT EXISTS Initial(Name varchar(50) not null,Organization_Name varchar(50) not null,Tagline varchar(100),Advertisement int not null default 0,Logo varchar(50),Productno int not null)");
	sql.query("INSERT INTO Initial(Organization_Name,Tagline,Advertisement,Logo,Name,Productno) VALUES (?,?,?,?,?,?)",[org,tag,adv,logo,na,pro],function(err,res,fields){if(err) throw err;});
	res.render("sample1-cont.ejs");
	res.end();


})


con.post("/furdet",upload.array("adv",3),function(req,res){
	var n;
	var filename=["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"];
	console.log(i);
	for(n=0;n<i;n++){
		filename[n]=req.files[n].originalname;
	}
	console.log(req.body);
	sql.query("CREATE TABLE IF NOT EXISTS Advertisement(Advertisement_img varchar(50) not null,Organization_Name varchar(50) not null)");
	for(n=0;n<i;n++){
		var g=filename[n];
		sql.query("INSERT INTO Advertisement(Advertisement_img,Organization_Name) VALUES (?,?)",[g,u],function(err,res,fields){if(err) throw err});
	}
	

	sql.query("CREATE TABLE IF NOT EXISTS Products(Product_name varchar(50) not null,Product_Price int not null default 0,Product_sdetails varchar(100), Product_detail varchar(500),Product_img1 varchar(50),Product_img2 varchar(50),Product_img3 varchar(50),Organization_Name varchar(50) not null,Stock int not null default 0,Seller varchar(50))",function
		(err,res,fields){if(err) throw err;});
	var nh={
		prono:j
	};

	res.render("sample1-prod1.ejs",nh);
	res.end();



})

con.post("/prod1",upload.array("pro"),function(req,res){

	for(g=0;g<j;g++){
		var a1=req.body.product[g];
		var a2=req.body.description[g];
		var a3=req.body.details[g];
		var a4=req.body.price[g];
		var kk=3*g;
		var a5=req.files[kk].originalname;
		var a6=req.files[kk+1].originalname;
		var a7=req.files[kk+2].originalname;
		var a8=req.body.stock[g];
		console.log("success");


		sql.query("INSERT INTO Products(Product_name,Product_Price,Product_sdetails, Product_detail,Product_img1,Product_img2,Product_img3,Organization_Name,Stock,Seller) VALUES (?,?,?,?,?,?,?,?,?,?)",[a1,a4,a2,a3,a5,a6,a7,u,a8,"All"],function(err,res,fields){
			if(err) throw err;
			console.log("success");
		})
	}		
	res.redirect("/");
	res.end();

	
})
con.get("/:id/home",function(req,resp){
	sql.query("USE web");
	var n1=req.params.id;
	adv.splice(0);
	
	sql.query("SELECT * FROM Initial WHERE Organization_Name = ?",n1,function(err,res,fields){
		if(err) throw err;
		
		var a1=res[0].Organization_Name;
		var a2=res[0].Tagline;
		var a3=res[0].Productno;

		var a4=res[0].Advertisement;
		var a7=res[0].Logo;
		var nn=res[0].Name;

		ii={
			org:a1,
			tag:a2,
			pno: a3,
			adv: a4,
			
			logo: a7

		}
			sql.query("SELECT * FROM myref WHERE Name = ?",nn,function(err,res,fields){
				a1=res[0].Name;
				a2=res[0].Contact_no;
				a3=res[0].Details;
				a4=res[0].Pic;
				
				ur={
					name:a1,
					cno:a2,
					det:a3,
					pic:a4
				}
				

		
				sql.query("SELECT * FROM Advertisement WHERE Organization_Name = ?",[n1],function(err,res,fields){
					for(f=0;f<ii.adv;f++){
						adv.push({
							img:res[f].Advertisement_img
						})
					}
				
			
					sql.query("SELECT * FROM Products WHERE Organization_Name = ?",[n1],function(err,res,fields){
						console.log(res.length);
						pro.splice(0);
						for(k=0;k<res.length;k++){
							pro.push({
								pname:res[k].Product_name,
								pprice:res[k].Product_Price,
								det:res[k].Product_sdetails,
								des:res[k].Product_detail,
								pic1:res[k].Product_img1,
								pic2:res[k].Product_img2,
								pic3:res[k].Product_img3,
								stock:res[k].Stock

							})
							
						}


				
						var m;
						var logi={
							name:naa,
							address:addr
						}
						
						var log={
							ii:ii,
							det:det,
							adv:adv,
							pro:pro,
							cart:cart,
							logi:logi,
							com:com
						}
						
						if(log!=undefined){
							sql.query("CREATE DATABASE IF NOT EXISTS "+ii.org);
							
							resp.render("home.ejs",log);
							resp.end();
							
						}
						
					
					})
				})
			})

	})
})


con.get("/:id/signup",function(req,res){
	var ff=req.params.id;
	sql.query("USE "+ff);
	res.render("signup.ejs");
	res.end();
})

con.post("/signed",function(req,res){
	console.log(req.body);
	var a1=req.body.name;
	var a2=req.body.no;
	var a3=req.body.email;
	var a4=req.body.adr;
	var a5=req.body.pwd;
	sql.query("CREATE TABLE IF NOT EXISTS Details(Name varchar(30) not null,Phone_no varchar(10) not null,Email varchar(40) not null,Address varchar(500),Password varchar(20))");
	sql.query("INSERT INTO Details(Name,Phone_no,Email,Address,Password) VALUES (?,?,?,?,?)",[a1,a2,a3,a4,a5]);
	req.session.loggedin=true;
	req.session.name=a1;
	req.session.adr=a4;
	na=a1;
	addr=a4;
	res.redirect("/"+ii.org+"/home");
	res.end();
})

con.post("/:id/add",function(req,res){
	var ff=req.params.id;
	sql.query("USE "+ff);
	if(req.session.loggin){
	var a1=req.body.title;
	var a2,a3,a4,a5,a6,a7;
	var n1=0;
	for(j=0;j<pro.length;j++){
		if(pro[j].pname==a1){
			a3=pro[j].det;
			a4=pro[j].des;
			a5=pro[j].pic1;
			a2=pro[j].pprice;
		}
	}
	console.log(a3);
	cart.push({
		pname:a1,
		pprice:a2,
		det: a3,
		des: a4,
		pic:a5
	})

	sql.query("INSERT INTO Cart(Name,Order_item,Price,Details,Description,Pic) VALUES (?,?,?,?,?,?)",[naa,a1,a2,a3,a4,a5],function(err){
			if(err) throw err;
				sql.query("CREATE TABLE IF NOT EXISTS Orders(Name varchar(30) not null,Address varchar(500),Order_item varchar(30),Price int not null,Seller varchar(50))",function(err){
			if(err) throw err;
			
			res.redirect("/"+ff+"/home");
			res.end();
		});
	});
	fg++;

	//console.log(cart);
	
	}
	else{
		console.log(cart);
		res.redirect("/"+ff+"/home");
		res.end();
	}

})
con.post("/:id/auth",function(request,response){
	var ff=request.params.id;
	sql.query("USE "+ff);

	sql.query("CREATE TABLE IF NOT EXISTS Cart(Name varchar(30) not null,Order_item varchar(30),Price int not null,Details varchar(100), Description varchar(1000),Pic varchar(50))",function(err,res,fields){
		if(err) throw err;
		console.log("created");
	});
	
	
	naa = request.body.userid;
	console.log(ff);
	var password = request.body.password;
	if (naa && password) {
		sql.query('SELECT * FROM Details WHERE Name = ? AND Password = ?', [naa, password], function(err, results, fields) {
			if(err) throw err;
			if (results.length > 0) {
				sql.query("SELECT * FROM Cart WHERE Name = ?",naa,function(err,res,fields){
					if(err) throw err;
					console.log("-----------"+res);
					if(res.length>=0) {
					for(z=0;z<res.length;z++){
						cart.push({
							pname:res[z].Order_item,
							pprice: res[z].Price,
							det: res[z].Details,
							des: res[z].Description,
							pic: res[z].Pic
						})
					}
				}
				})
				addr=results[0].Address;
				request.session.loggin=true;
				response.redirect("/"+ff+"/home");
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
})

con.post("/:id/logout",function(req,res){
	var ff=req.params.id;
	naa=null;
	addr=null;
	req.session.loggin=false;
	cart.splice(0);
	res.redirect("/"+ff+"/home");
	res.end();
})
con.post("/:id/remove",function(req,res){
	var a1=req.body.pos;
	var ff=req.params.id;
	console.log(naa);
	console.log(cart[a1].pname);
	sql.query("USE "+ff);
	var hk=cart[a1].pname;
	
	sql.query("DELETE FROM Cart WHERE Name = ? AND Order_item = ? ",[naa,hk],function(err,results,fields){
		if(err) throw err;
	})
	cart.splice(a1,1);
	//console.log(cart);
	res.redirect("/"+ff+"/home");
	res.end();
})
con.post("/:id/check",function(req,resp){
	var ff=req.params.id;
	sql.query("USE web");
	var jk=cart.length;
	//console.log(cart.length);
	var w=0;
	var gh=0;
	f(w);
	function f(w){
		sql.query("SELECT * FROM Products WHERE Product_name=? ",cart[w].pname,function(err,res,fields){
		var nj=res[0].Seller;
		var nnm=res[0].Stock;
		console.log(nj);
		sql.query("USE "+ff);

		sql.query("INSERT INTO Orders(Name,Address,Order_item,Price,Seller) VALUES (?,?,?,?,?)",[naa,addr,cart[w].pname,cart[w].pprice,nj],function(err,res,fields){
			if(err) throw err;

			sql.query("USE web",function(err){
				if(err) throw err;
			
			console.log(w);
			
				
				nnm--;
				
				sql.query("UPDATE Products SET Stock = ? WHERE Product_name=?",[nnm,cart[w].pname],function(err,res,fields){
					if(err) throw err;
					cart.splice(w,1);
					
					gh++;
					console.log("item"+gh);
					if(gh<jk){
						f(w);
					}
					else{
						cart.splice(0);
						resp.redirect("/"+ff+"/home");
						resp.end();
					}


									
				})
			})

			})
			
		})
		

		
	}
	sql.query("USE "+ff,function(err,res,fields){})
	sql.query("DELETE FROM Cart WHERE Name = ?",naa,function(err,results,fields){
		if(err) throw err;
	})
	
	
	
})

con.get("/:id/info",function(req,res){
	res.render("info.ejs",ur);
	res.end();
})
con.get("/abc123",function(req,res){
	sql.query("SELECT * FROM Orders",function(err,results,fields){
		res.send(results);
		res.end();
	})
})


con.post("/:id/de",function(req,res){
	var ff=req.params.id;
	var detail;
	var a1=req.body.title;
	console.log(a1);
	var a2,a3,a4,a5,a6,a7;
	var n1=0;
	
	for(j=0;j<ii.pno;j++){
		if(pro[j].pname==a1){
			a3=pro[j].det;
			a4=pro[j].des;
			a5=[pro[j].pic1,pro[j].pic2,pro[j].pic3];
			a2=pro[j].pprice;
		}
	}
	detail={
		name:ff,
		pname:a1,
		pprice:a2,
		det: a3,
		des: a4,
		pic:a5
	}
	
	console.log(detail);
	res.render("detail.ejs",detail);
	res.end();

})
con.get("/:id/admin",function(req,res){
	var ff=req.params.id;
	var gg={
		name:ff
	}

	sql.query("USE "+ff);
	sql.query("CREATE TABLE IF NOT EXISTS Admin(Username varchar(50) not null,Name varchar(50) not null,Password varchar(50) not null)");
	res.render("admin.ejs",gg);
	res.end();

})
con.post("/:id/adminn",function(req,res){
	var ff=req.params.id;
	var gg={
		name:ff
	}
	res.render("admins.ejs",gg);
	res.end();

})
con.post("/:id/purhis",function(req,resp){
	var df=[];
	var a1=req.body.name;
	var a2=req.params.id;
	sql.query("USE "+a2);
	sql.query("SELECT * FROM Orders WHERE Name=?",a1,function(err,res,fields){
		console.log(res[0]);
		for(h=0;h<res.length;h++){
			df.push({
				item: res[h].Order_item,
				price: res[h].Price
			})
		}
		console.log(df);
		var wq={
			df:df,
			name:a1
		}
		resp.render("purhis.ejs",wq);
		resp.end();

	})
})
con.post("/:id/adminsign",function(req,res){
	var ff=req.params.id;
	var gg={
		name:ff
	}
	var a1 = req.body.name  ;
	var a2 = req.body.uname  ;
	var a3 = req.body.pwd  ;
	var a4 = req.body.ref  ;
	sql.query("USE "+ff);
	if(a4==1){
		sql.query("INSERT INTO Admin(Username,Name,Password) VALUES (?,?,?)",[a2,a1,a3],function(err){
			if(err) throw err;
			res.redirect("/"+ff+"/admin");
			res.end();
		})

	}
	else{
		res.send("Wrong code");
		res.end();
	}	
	
})
con.post("/:id/admins",function(req,resp){
	var sel=[];
	var ff=req.params.id;
	sql.query("USE "+ff);
	var name = req.body.uname;
	var password = req.body.password;
	if (name && password) {
		sql.query('SELECT * FROM Admin WHERE Username = ? AND Password = ?', [name, password], function(err, results, fields) {
			if(err) throw err;
			if (results.length > 0) {
				sql.query("USE web");
				var nam=results[0].Name;
				console.log(nam);
				sql.query("SELECT * FROM Products WHERE Organization_Name=? AND Seller=? OR Seller=?",[ff,"All",nam],function(err,res,fields){
					if(err) throw err;
					for(k=0;k<results.length;k++){
							sel.push({
								pname:res[k].Product_name,
								pprice:res[k].Product_Price,
								det:res[k].Product_sdetails,
								des:res[k].Product_detail,
								pic1:res[k].Product_img1,
								pic2:res[k].Product_img2,
								pic3:res[k].Product_img3,
								stock:res[k].Stock

							})
							
						}
					var b={
						name:nam,
						sel:sel,
						a:ff
					}
					console.log(b.sel);
					req.session.loggedin=true;
					resp.render("open.ejs",b);
					resp.end();

				})
				
				
				
			} else {
				resp.send('Incorrect Username and/or Password!');
				resp.end();
			}			
			
		});
	} else {
		resp.send('Please enter Username and Password!');
		resp.end();
	}
	
})
con.post("/:id/sdashboard",function(req,resp){
	var ff=req.params.id;
	var sel=[];
	
	var a1=req.body.name;
	sql.query("USE web");
				
				sql.query("SELECT * FROM Products WHERE Organization_Name=? AND Seller=? OR Seller=?",[ff,"All",a1],function(err,res,fields){
					for(k=0;k<res.length;k++){
							sel.push({
								pname:res[k].Product_name,
								pprice:res[k].Product_Price,
								det:res[k].Product_sdetails,
								des:res[k].Product_detail,
								pic1:res[k].Product_img1,
								pic2:res[k].Product_img2,
								pic3:res[k].Product_img3,
								stock:res[k].Stock

							})
							
						}
					var b={
						name:a1,
						sel:sel,
						a:ff
					}
					console.log(b.sel);
					req.session.loggedin=true;
					resp.render("dashboard.ejs",b);
					resp.end();

				})
	

})

con.post("/:id/sadd",function(req,res){
	var ff=req.params.id;
	var gg=req.body.name;
	var g={
		name:gg,
		nam:ff,
	}
	res.render("add.ejs",g);
	res.end();

	
})

con.post("/:id/saddp",upload.array("pro"),function(req,res){
	var ff=req.params.id;
	console.log(ff);
	sql.query("USE web");

		var a9=req.body.name;
		var a1=req.body.product;
		var a2=req.body.description;
		var a3=req.body.details;
		var a4=req.body.price;
		var a5=req.files[0].originalname;
		var a6=req.files[1].originalname;
		var a7=req.files[2].originalname;
		var a8=req.body.stock;


		sql.query("INSERT INTO Products(Product_name,Product_Price,Product_sdetails, Product_detail,Product_img1,Product_img2,Product_img3,Organization_Name,Stock,Seller) VALUES (?,?,?,?,?,?,?,?,?,?)",[a1,a4,a2,a3,a5,a6,a7,ff,a8,a9],function(err,results,fields){
			if(err) throw err;
			console.log(ff);
			console.log("success");
		})		
	res.send("Item added successfully");
	res.end();

	
})
con.post("/:id/sorders",function(req,resp){
	var ff=req.params.id;
	var sel=[];
	
	var a1=req.body.name;
	sql.query("USE "+ff);
				
				sql.query("SELECT * FROM Orders WHERE Seller=? OR Seller=?",["All",a1],function(err,res,fields){
					if(err) throw err;
					console.log(res);
					for(k=0;k<res.length;k++){
							sel.push({
								pname:res[k].Name,
								addr:res[k].Address,
								item:res[k].Order_item,
								price:res[k].Price

							})
							
						}
					var b={
						name:a1,
						sel:sel,
						a:ff
					}
					req.session.loggedin=true;
					resp.render("sell.ejs",b);
					resp.end();

				})
	

})
con.post("/:id/slogout",function(req,res){
	var ff=req.params.id;
	req.session.loggedin=false;	
	res.redirect("/"+ff+"/admin");
	res.end();
})
con.post("/:id/supdate",function(req,res){
	var ff=req.params.id;
	var a1=req.body.name;
	var g={
		name: a1,
		id:ff
	}
	res.render("upopen.ejs",g);
	res.end();
})
con.post("/:id/ustock",function(req,res){
	sql.query("USE web");
	var a1=req.params.id;
	var a2=req.body.name;
	var a3=req.body.pna;
	var a4=req.body.stock;
	sql.query("UPDATE Products SET Stock=? WHERE Product_name=? AND Organization_Name=? AND (Seller=? OR Seller=?)",[a4,a3,a1,a2,"All"],function(err){
		if(err) throw err;
		console.log("Updated");
		console.log(a1+":"+a2+":"+a3+":"+a4+":");
	});
	res.send("Updated successfully");
	res.end();
})

con.post("/:id/uprice",function(req,res){
	sql.query("USE web");
	var a1=req.params.id;
	var a2=req.body.name;
	var a3=req.body.pna;
	var a4=req.body.price;
	sql.query("UPDATE Products SET Product_Price=? WHERE Product_name=? AND Organization_Name=? AND (Seller=? OR Seller=?)",[a4,a3,a1,a2,"All"],function(err){
		if(err) throw err;
	});
	res.send("Updated successfully");
	res.end();
})
con.post("/:id/udes",function(req,res){
	sql.query("USE web");
	var a1=req.params.id;
	var a2=req.body.name;
	var a3=req.body.pna;
	var a4=req.body.des;
	sql.query("UPDATE Products SET Product_sdetails=? WHERE Product_name=? AND Organization_Name=? AND (Seller=? OR Seller=?)",[a4,a3,a1,a2,"All"],function(err){
		if(err) throw err;
	});
	res.send("Updated successfully");
	res.end();
})
con.post("/:id/upic",upload.array("pic"),function(req,res){
	sql.query("USE web");
	var a1=req.params.id;
	var a2=req.body.name;
	var a3=req.body.pna;
	var a5=req.files[0].originalname;
	var a6=req.files[1].originalname;
	var a7=req.files[2].originalname;
	sql.query("UPDATE Products SET Product_img1=? WHERE Product_name=? AND Organization_Name=? AND (Seller=? OR Seller=?)",[a5,a3,a1,a2,"All"],function(err){
		if(err) throw err;
	});
	sql.query("UPDATE Products SET Product_img2=? WHERE Product_name=? AND Organization_Name=? AND (Seller=? OR Seller=?)",[a6,a3,a1,a2,"All"],function(err){
		if(err) throw err;
	});
	sql.query("UPDATE Products SET Product_img3=? WHERE Product_name=? AND Organization_Name=? AND (Seller=? OR Seller=?)",[a7,a3,a1,a2,"All"],function(err){
		if(err) throw err;
	});
	res.send("Updated successfully");
	res.end();
})































con.listen(3000);

