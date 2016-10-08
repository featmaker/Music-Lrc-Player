<?php 
header('content="text/html;charset=utf-8"');
$method = $_GET['method'];
if ($method == 'getList') {
	$list = [];
	$files = scandir('mp3/song');
	foreach ($files as $key => $value) {
		if ($value == '.' || $value == '..') {
			continue;
		}
		$list[] = explode('.',iconv("gb2312", "utf-8", $value))[0];
	}
	echo json_encode(['name'=>$list]);
} elseif ($method == 'getLrc') {
	$name = iconv("utf-8", "gb2312", $_GET['name'].'.lrc');
	$path = './mp3/lrc/'.$name;
	if (file_exists($path)) {
		$lrc = file_get_contents($path);
		$data = [];
		$times = [];
		$time = preg_match_all('/(\[.*\])(.*)/',$lrc,$data);
		foreach ($data[1] as $key => $value) {
			$min = intval(substr($value,1,3))*60;
			$sec = (floatval(substr($value,4,-1)));
			$secs = $min+$sec;
			$times[] = $secs;
		}
		echo json_encode(['msg'=>'yes','time'=>$times,'lrc'=>$data[2]]);
	} else {
		echo json_encode(['msg'=>'no']);
	}
}