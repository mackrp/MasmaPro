
$(document).ready(function(e) {

		$(".stepsForm").stepsForm({
			width			:'100%',
			active			:0,
			errormsg		:'Check faulty fields.',
			sendbtntext		:'',
			posturl			:'core/demo_steps_form.php',
			theme			:'green',
		});

		$(".container .themes>span").click(function(e) {
			$(".container .themes>span").removeClass("selectedx");
			$(this).addClass("selectedx");
            $(".stepsForm").removeClass().addClass("stepsForm");
			$(".stepsForm").addClass("sf-theme-"+$(this).attr("data-value"));
        });
    });
