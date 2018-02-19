//ringMod.js
// 16 Feb2018
//A ring buffer for storing data in type array

function ring(hname,size,type,mult,slope,intercept,logfunc,lfargs,format,fargs){
//function ring(hname,size,type,mult,slope,intercept,logfunc,format,fargs){
  this.hname=hname;
  this.format=format;
  this.fargs=fargs;
  this.logfunc=logfunc;
  this.lfargs=lfargs;
  this.mult=mult;
  this.slope=slope;
  this.intercept=intercept;
  this.size=size;
  this.buf=new type(this.size);
  this.ptr=0;
  this.dptr=0;
  this.cnt=0;
}

ring.prototype.insert=function(){
//  console.log(this.logfunc);
  this.buf[this.ptr]=this.logfunc(this.lfargs)*this.mult;
//  this.buf[this.ptr]=this.logfunc()*this.mult;
  this.ptr++;
  if(this.ptr>=this.size)this.ptr=0;
  if(this.cnt<this.size)this.cnt++;
};

ring.prototype.output=function(){
  var i,j,a;
    if(this.cnt<this.size){
     j=0;
    }else{
     j=this.ptr;
    }
  for(i=0;i<this.cnt;i++){
   a=this.buf[j]/this.mult*this.slope+this.intercept;
   if(this.format){
    console.log(i,'\t',this.format(a,this.fargs));
   }else{
    console.log(i,'\t',a);
   }
   j++;
   if(j>=this.size)j=0;
  }//next i
};

ring.prototype.getDatum=function(i){
  var a;
  if(i===0){
    if(this.cnt<this.size){
     this.dptr=-1;
    }else{
     this.dptr=this.ptr-1;
    }
  }
  this.dptr++;
  if(this.dptr>=this.size)this.dptr=0;
  a=this.buf[this.dptr]/this.mult*this.slope+this.intercept;
  if(this.format) return this.format(a,this.fargs);
  return a;
};
module.exports=ring;













