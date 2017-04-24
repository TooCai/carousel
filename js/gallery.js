;
(function($,undefined){
	//
	if(!$){throw new Error("该插件基于jQuery!!!");return;}
	var Gallery = function(){
		//轮播器容器(jQuery对象)
		this.ele = null;
		//轮播图片容器(jQuery对象)
		this.galleryEle = null;
		//导航器容器(jQuery对象)
		this.navEle = null;
		//是否循环(默认不循环)
		this.loop = false;
		//间隔时间(默认3000)
		this.interval = 3000;
		//动画执行时间
		this.duration = 0.5;
		//定时器引用
		this.handler = null;
		//图片个数
		this.size = 0;
		//当前循环索引下标
		this.currentNum = 0;
		//图片宽度
		this.width = 0;
		//图片高度
		this.height = 0;
		//是否显示导航器
		this.showNav = false;
		//是否显示左、右按钮
		this.showBtn = false;
		//设置轮播类型(-1:水平(默认);1:垂直)
		this.type = -1;
		//是否正在运行(默认是false)
		this.isRunning = false;
		/*初始化函数*/
		this.init = function(param){
			if(!param.ele || !param.width || !param.height){
				throw new Error("参数错误...");
			}
			//设置轮播器容器
			this.ele = param.ele;
			//设置是否循环
			this.loop = !!param.loop;
			//设置间隔时间
			this.interval = param.interval || this.interval;
			//设置动画执行时间
			this.duration = param.duration || this.duration;
			//设置图片个数
			this.size = param.size;
			//设置图片宽度
			this.width = param.width;
			//设置图片高度
			this.height = param.height;
			//设置导航器
			this.showNav = !!param.showNav;
			//设置是否显示左、右按钮
			this.showBtn = !!param.showBtn;
			//设置轮播类型
			this.type = param.type || this.type;

			this.initElement();
			//初始化CSS
			this.initCSS();
			return this;
		};
		/*初始化元素对象*/
		this.initElement = function(){
			//初始化图片容器
			this.galleryEle = this.ele.children(".gallery").eq(0);
			//判断是否显示导航器
			if(this.showNav){
				//创建导航器
				var nav = $("<ul class='nav'></ul>");
				for(var i = 0;i<this.size;i++){
					nav.append("<li data-index=\"" + i + "\" class='nav-item " + (i===0?"active":"") + "'></li>");
				}
				this.ele.append(nav);
				this.navEle = this.ele.children(".nav").eq(0);
				//添加代理监听事件
				this.navEle.on("click",".nav-item",function(){
					//判断点击的是否是当前元素;如果是,直接返回
					if($(this).hasClass("active")){
						return;
					}
					//获取被点击元素的索引
					var index = parseInt($(this).attr("data-index"));
					console.log(index);
					//TODO 跳转到点击的导航器
				});
			}
		};
		/*设置CSS*/
		this.initCSS = function(){
			//设置轮播容器宽高
			this.ele.css({
				width:this.width + "px",
				height:this.height + "px"
			});
			//如果轮播类型是水平的,则设置图片容器宽度;垂直的,则设置图片高度
			if(this.type === -1){
				//循环时需要将第一个添加到最后
				var _width = this.loop?(this.width * (this.size + 1)) : (this.width * this.size);
				this.galleryEle.css("width",_width + "px");
			}else if(this.type === 1){
				//循环时需要将第一个添加到最后
				var _height = this.loop?(this.height * (this.size + 1)) : (this.height * this.size);
				this.galleryEle.css("height",_height + "px");
				this.galleryEle.children(".gallery-item").css("float","none")
			}
			//设置导航器的位置,使其位置居中
			var navLeft = (this.width - parseInt(this.navEle.css("width")))/2;
			this.navEle.css("left",navLeft+"px");
			return this;
		};
		/*启动函数*/
		this.start = function(){
			//如果已经运行了,再次执行该函数返回false
			if(this.isRunning){
				return false;
			}
			//设置为已运行
			this.isRunning = true;
			//判断是否显示导航器
			var fun = this.showNav?function(){
				//图片轮播
				this.one();
				//导航器轮播
				this.oneNav();
			}:function(){
				//图片轮播
				this.one();
			};
			//设置定时器
			this.handler = setInterval(fun.bind(this),this.interval);

			return this;
		};
		/*暂停函数*/
		this.stop = function(){
			if(this.isRunning){
				//清除定时器
				clearInterval(this.handler);
				//定时器引用设为null
				this.handler = null;
				//设置为暂停状态
				this.isRunning = false;
			}

			return this;
		};
		/*图片轮播*/
		this.one = function(){
			var temp = this.ele.children(".gallery").eq(0);
			//当前循环索引自增
			this.currentNum++;
			//为了使动画能够循环,在图片最后添加第一张,即此处需+1
			//执行到最后一张时,回到第一张
			if(this.currentNum === this.size + 1){
				this.currentNum = 0;
				//最后一张到第一张时不执行动画
				this.galleryEle.css({
					"transform":"translate3d(0px,0px,0px)",
					"transition-duration":"0s"
				});
				this.currentNum++;
			}
			/*
			var _self = this;
			//setTimeout为了解决最后一张到第一张时,动画执行是反的问题
			setTimeout(function(){
				console.log(_self.type,temp)
				var t3d = "translate3d(";
				if(_self.type === -1){
					t3d += (-_self.currentNum * _self.width) + "px,0px,0px)";
				}else if(_self.type === 1){
					t3d += "0px," + (-_self.currentNum * _self.height) + "px,0px)";
				}
				_self.galleryEle.css({
					"transition":"transform " + _self.duration +"s ease-in",
					"transform":t3d
				});
			},0);*/
			//setTimeout为了解决最后一张到第一张时,动画执行是反的问题
			setTimeout(function(){
				var t3d = "translate3d(";
				if(this.type === -1){
					t3d += (-this.currentNum * this.width) + "px,0px,0px)";
				}else if(this.type === 1){
					t3d += "0px," + (-this.currentNum * this.height) + "px,0px)";
				}
				this.galleryEle.css({
					"transition":"transform " + this.duration +"s ease-in",
					"transform":t3d
				});
			}.bind(this),5);
		};
		this.oneNav = function(){
			var temp = this.currentNum === this.size?0:this.currentNum;
			this.navEle.children(".active").toggleClass("active");
			this.navEle.children().eq(temp).addClass("active");
		}
	}
	$.fn.gallery = function(param){
		param.ele = $(this).eq(0);
		return new Gallery().init(param);
	};
})(window.jQuery || window.$);