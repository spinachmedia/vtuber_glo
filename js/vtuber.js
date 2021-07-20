var ripSync = false;

$(function(){

	var changeFlg = false;
    
    var mode = "BASE";
    $(document).keydown(function(e) {
        var key = "BASE";
        switch (e.keyCode) {
            case 90://Zキー押下時
	            key = "z";
	            break;
            case 88://Xキー押下時
	            key = "x";
	            break;
            case 67://Cキー押下時
	            key = "c";
	            break;
        }
        mode = key;
        if(key!="BASE"){
        
        	if(changeFlg){
        		return;
        	}
        	changeFlg = true;
        	
        
            var currentImg = $(".chara_01 img").attr("src");
            var result = currentImg.replace(/^.+charactor_01\/.+(\d{2}).gif/,"$1");
            $(".chara_01 img").attr("src","./charactor_01/"+key+"_"+result+".gif");
        }
    });
    
    $(document).keyup(function(e) {
        var flg = true;
        if(flg){
            mode = "BASE";
            $(".chara_01 img").attr("src","./charactor_01/base_01.gif");
            changeFlg = false;
        }

    });
    
    setupMicrophone();
    startAnimation();
})

var startAnimation = function(){

	var reg = /^.+charactor_01\/.+\d{2}.png/;
    var currentImg = $(".chara_01 img").attr("src");
    
    // 現在の画像番号を取得
    var result = currentImg.replace(/^.+charactor_01\/.+(\d{2}).gif/,"$1");
    
    if(!ripSync){
        //画像をベースに戻す
        result = currentImg.replace(/(\d{2}).gif/,"01.gif");
        $(".chara_01 img").attr("src",result);
        console.log("to Base:" + result);
    } else {
    	//画像を口パクアニメに変更
    	if(result === "01") {
		    result = currentImg.replace(/(\d{2}).gif/,"02.gif");
		    $(".chara_01 img").attr("src",result);
        	console.log("to Anim:" + result);
	    }
    }
    setTimeout(startAnimation,100);
}

var setupMicrophone = function(){
navigator.getUserMedia(
	{audio : true},
	function(stream){
		var audioElem = document.querySelector('audio');
		if ('srcObject' in audioElem) {
			// 最近のブラウザ向け
			audioElem.srcObject = stream;
		} else {
			// 昔のブラウザ向け
			audioElem.src = URL.createObjectURL(stream);
		}
		var audioContext = new AudioContext();
		var analyser = audioContext.createAnalyser();
		var timeDomain = new Float32Array(analyser.frequencyBinCount);
		var frequency = new Uint8Array(analyser.frequencyBinCount);
		audioContext.createMediaStreamSource(stream).connect(analyser);

		(function animation(){
			analyser.getFloatTimeDomainData(timeDomain);
			analyser.getByteFrequencyData(frequency);

            var score = 0;
            //frequencyの平均値が50以上なら
            for( var i = 0; i < frequency.length; i++ ){
                score = score + frequency[i];
            }
            score = score / frequency.length;
            
            if(score > 15){
                ripSync = true;
            } else {
                ripSync = false;
            }
			
            setTimeout(function(){
                requestAnimationFrame(animation);    
            },100);
			
		})();

	},
	console.log
);
}
