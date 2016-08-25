<!DOCTYPE html>
<html>
<head>
<title>品质家装_佳诚装饰</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" content="Majestic Responsive web template, Bootstrap Web Templates, Flat Web Templates, Andriod Compatible web template, 
Smartphone Compatible web template, free webdesigns for Nokia, Samsung, LG, SonyErricsson, Motorola web design" />
<script type="application/x-javascript"> addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false); function hideURLbar(){ window.scrollTo(0,1); } </script>
<link href="jczs_website_front_end/css/bootstrap.css" rel='stylesheet' type='text/css' />
<link href="jczs_website_front_end/css/style.css" rel='stylesheet' type='text/css' />
<!-- <link href='jczs_website_front_end/css/titilliumweb.css' rel='stylesheet' type='text/css'> -->
<script src="jczs_website_front_end/js/jquery-1.11.0.min.js"></script>
<script src="jczs_website_front_end/js/common.js"></script>
<!-- bxSlider Javascript file -->
<script src="jczs_website_front_end/js/bxslider/dist/jquery.bxslider.min.js"></script>
<!-- bxSlider CSS file -->
<link href="jczs_website_front_end/js/bxslider/dist/jquery.bxslider.css" rel="stylesheet" />
<!---- start-smoth-scrolling---->
<script type="text/javascript" src="jczs_website_front_end/js/move-top.js"></script>
<script type="text/javascript" src="jczs_website_front_end/js/easing.js"></script>
<script type="text/javascript">
			jQuery(document).ready(function($) {
				$(".scroll").click(function(event){		
					event.preventDefault();
					$('html,body').animate({scrollTop:$(this.hash).offset().top},1000);
				});

				$('.bxslider').bxSlider({
					auto: true,
					pager: false,
					controls: true
				});

				$('.topSlider li img').click(function (event){
					if ($(this).attr('des') != '') {
						location.href = $(this).attr('des');
					}
				});
			});
		</script>
<!---- start-smoth-scrolling---->
</head>
<body>
	<?php
		include_once "jczs_website_front_end/libs/conn.php";
		include_once "jczs_website_front_end/navigation.php";
		include_once "jczs_website_front_end/common.php";

		$companyIntroduction = getArticlesFromCategory("公司简介");
		$caseTypeArr = getCaseTypeArr();
		$activityArr = getPicsFromCategory("营销活动");
		$caseArrClassifiedByDesigner = getCaseArrClassifiedByDesigner();
		$backgroundPicArr = getPicsFromCategory("背景图片");

		function sortDesignerClassifiedCaseArrByDesignerPriority ($designerClassifiedCaseArr){
			$finalArr = array();
			foreach ($designerClassifiedCaseArr as $key => $caseArr) {
				$priorityInfo = getDesignerPriorityInfoByDesignerRealName($key);
				if (count($priorityInfo) > 0) {
					$priority = $priorityInfo[0]["priority"];
					$priorityTitle = $priorityInfo[0]["priorityTitle"];
					if ($priority != "") {
						$priority = intval($priority);
						if (count($finalArr) > 0) {
							for ($i=0; $i < count($finalArr); $i++) {
								if ($finalArr[$i]["designerPriority"] == "") {
									array_splice($finalArr, $i, 0, array(
																		array("designerRealName"=>$key, "designerPriority"=>$priority, "designerPriorityTitle"=>$priorityTitle, "picsArr"=>$caseArr)
																	)
									);
									break;
								}
								else if ($finalArr[$i]["designerPriority"] < $priority) {
									if ($i >= count($finalArr) - 1) {
										array_push($finalArr, array("designerRealName"=>$key, "designerPriority"=>$priority, "designerPriorityTitle"=>$priorityTitle, "picsArr"=>$caseArr));
										break;
									}
									else {
										continue;
									}
								}
								else if ($finalArr[$i]["designerPriority"] >= $priority) {
									array_splice($finalArr, $i, 0, array(
																		array("designerRealName"=>$key, "designerPriority"=>$priority, "designerPriorityTitle"=>$priorityTitle, "picsArr"=>$caseArr)
																	)
									);
									break;
								}
							}
						}
						else {
							array_push($finalArr, array("designerRealName"=>$key, "designerPriority"=>$priority, "designerPriorityTitle"=>$priorityTitle, "picsArr"=>$caseArr));
						}
					}
					else {
						array_push($finalArr, array("designerRealName"=>$key, "designerPriority"=>"", "designerPriorityTitle"=>"", "picsArr"=>$caseArr));
					}
				}
			}
			return $finalArr;
		}
		$sortedDesignerClassifiedCaseArr = sortDesignerClassifiedCaseArrByDesignerPriority($caseArrClassifiedByDesigner);
	?>
		
	<!--banner-starts-->
	<div class="banner" id="home">
		<?php
			$sliderTopAlbum = getPicsFromCategory('首页顶部幻灯');
			if (count($sliderTopAlbum) > 0) {
		?>
			<div class="sliderWrapper topSlider">
				<ul class="bxslider">
		<?php
				for ($i=0; $i < count($sliderTopAlbum); $i++) { 
					$sliderTopPic = $sliderTopAlbum[$i];
					$sliderTopImgArr = wp_get_attachment_image_src($sliderTopPic["ID"], "large", false);
					if ($sliderTopImgArr != false) {
						$sliderTopImgUrl = $sliderTopImgArr[0];
		?>
						<li><img src="<?php echo $sliderTopImgUrl; ?>" alt="<?php echo $sliderTopPic["post_title"]; ?>" des="<?php if ($sliderTopPic["post_content"]) {echo $sliderTopPic["post_content"];} else {echo "";} ?>" /></li>
		<?php
					}
				}
			}
		?>
			</ul>
		</div>
	</div>
	<!--banner-ends--> 
	<!--welcome-starts--> 
	<div class="welcome">
		<div class="container">
			<div class="welcome-top">
				<!-- <h1><?php echo $companyIntroduction[0]["post_title"]; ?></h1> -->
				<p style="text-align: left; text-indent: 2em; font-weight: 600;"><?php echo $companyIntroduction[0]["post_content"]; ?></p>
			</div>
			<?php
				$caseDemoArr = array();
				foreach ($caseTypeArr as $key => $caseArr) {
					$caseDemo = array();
					for ($i=0; $i < count($caseArr); $i++) {
						for ($j=0; $j < count($caseArr[$i]["pics"]); $j++) {
							$tmpArr = $caseArr[$i]["pics"][$j];
							$tmpArr["case_name"] = $caseArr[$i]["name"];
							$tmpArr["case_description"] = $caseArr[$i]["description"];
							$tmpArr["case_term_id"] = $caseArr[$i]["term_id"];
							if (count($caseDemo) > 0) {
								for ($k=0; $k < count($caseDemo); $k++) {
									if (!array_key_exists("priority", $tmpArr)) {
										array_push($caseDemo, $tmpArr);
										break;
									}
									else if (!array_key_exists("priority", $caseDemo[$k])) {
										array_splice($caseDemo, $k, 0, array($tmpArr));
										break;
									}
									else if ($caseDemo[$k]["priority"] < $tmpArr["priority"]) {
										continue;
									}
									else if ($caseDemo[$k]["priority"] > $tmpArr["priority"]) {
										array_splice($caseDemo, $k, 0, array($tmpArr));
										break;
									}
								}
							}
							else {
								array_push($caseDemo, $tmpArr);
							}
						}
					}
					$caseDemoArr[$key] = $caseDemo;
				}
			?>
			<div class="welcome-bottom">
				<?php
					foreach ($caseDemoArr as $key => $arr) {
						if (count($arr) > 0) {
				?>
							<div class="col-md-3 welcome-left">
								<div class="welcome-one">
									<a href="jczs_website_front_end/casesingle.php?term_id=<?php echo $arr[0]["case_term_id"]; ?>"><img height="200" src="<?php echo $arr[0]["guid"]; ?>" alt="" /></a>
								</div>
								<h4 style="font-size: 1.2em; font-weight: 400; color: #97262A; margin: 0;"><?php echo $key; ?></h4>
								<p>
									<?php 
										$descriptionArr = getDescriptionThroughCategoryName($key);
										if (count($descriptionArr) > 0) {
											echo nl2br($descriptionArr[0]["description"]);
										}
								 	?>
								</p>
							</div>
				<?php
						}
					}
				?>
				<div class="clearfix"></div>
			</div>
		</div>
	</div>
	<!--welcome-ends--> 
	<!--offer-starts-->
	<div class="offer">
		<div class="container">
			<div class="offer-top heading">
				<h2 style="font-size: 1.6em;">设计师</h2>
			</div>
			<div class="offer-bottom">
				<?php
					for ($designerIndex=0; $designerIndex < count($sortedDesignerClassifiedCaseArr) && $designerIndex < 4; $designerIndex++) {
				?>
							<div class="col-md-3 offer-left">
								<a href="jczs_website_front_end/designersingle.php?designerrealname=<?php echo $sortedDesignerClassifiedCaseArr[$designerIndex]["designerRealName"]; ?>"><img height="200" src="<?php echo $sortedDesignerClassifiedCaseArr[$designerIndex]["picsArr"][0]["designerProfileImage"]; ?>" alt="设计师未上传" /></a>
								<h4><a href="jczs_website_front_end/designersingle.php?designerrealname=<?php echo $sortedDesignerClassifiedCaseArr[$designerIndex]["designerRealName"]; ?>"><?php echo $sortedDesignerClassifiedCaseArr[$designerIndex]["picsArr"][0]["designerRealName"]; ?></a></h4>
								<div class="o-btn">
									<a href="jczs_website_front_end/designersingle.php?designerrealname=<?php echo $sortedDesignerClassifiedCaseArr[$designerIndex]["designerRealName"]; ?>">更多</a>
								</div>
							</div>
				<?php
					}
				?>
				<div class="clearfix"></div>
			</div>
		</div>
	</div>
	<!--offer-ends--> 
	<?php
		$slideAlbum = getPicsFromCategory('首页幻灯');
		if (count($slideAlbum) > 0) {
	?>
			<div class="sliderWrapper">
				<ul class="bxslider">
	<?php
			for ($i=0; $i < count($slideAlbum); $i++) { 
				$slidePic = $slideAlbum[$i];
				$sliderImgArr = wp_get_attachment_image_src($slidePic["ID"], "large", false);
				if ($sliderImgArr != false) {
					$imgUrl = $sliderImgArr[0];
					$originalWidth = $sliderImgArr[1];
					$originalHeight = $sliderImgArr[2];
	?>
					<li><img src="<?php echo $imgUrl; ?>" alt="<?php echo $slidePic["post_title"]; ?>" /></li>
	<?php
				}
			}
	?>
				</ul>
			</div>
	<?php
		}
		include_once "jczs_website_front_end/footer.php";
	?>
</body>
</html>