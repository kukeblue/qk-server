var z='{0}';
export function encodeToGb2312(str: string){
    var strOut="";
    for(var i = 0; i < str.length; i++){
        var c = str.charAt(i); 
        var code = str.charCodeAt(i);
        if(c==" ") strOut +="+";
        else if(code >= 19968 && code <= 40869){
            let index = code - 19968;
            strOut += "%" + z.substr(index*4,2) + "%" + z.substr(index*4+2,2);
        }
        else{
            strOut += "%" + str.charCodeAt(i).toString(16);
        }
    }
    return strOut;
}
export function decodeFromGb2312(str: string){
   var strOut = '';
   for (var i=0;i<str.length; i++){
      var c = str.charAt(i);
      // +是空格
      if (c == '+'){
         strOut += ' ';
      }
      // a,b,c,1,2等，非%开头的，直接返回本身
      else if (c != '%'){
         strOut += c;
      }
      // %开头
      else{
         i++;
         var nextC = str.charAt(i);
         // 数字，则不是汉字
         if (!isNaN(parseInt(nextC))){
            i++;
            strOut += decodeURIComponent(c+nextC+str.charAt(i));
         }
         else{
            var x = new String();
            try
            {
               var code = str.substr(i,2)+str.substr(i+3,2);
               i = i + 4;
               
               var index = -1;
               while ((index = z.indexOf(code,index+1)) != -1){
                  if (index%4 == 0){
                     strOut += String.fromCharCode(index/4+19968);
                     break;
                  }
               }
            }catch(e){}
         }
      }
   }
   return strOut;
}