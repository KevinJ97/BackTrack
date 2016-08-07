angular.module('BackTrack', ['angularAudioRecorder']).controller('homeController', function($scope) {

	$scope.playButton = true;
	$scope.randomHide = false;
	$scope.recordButton = function recordButton() {
		if ($scope.playButton) {
			$scope.playButton = false;
			recorder.startRecord();
		} else {
			$scope.playButton = true;
			recorder.stopRecord();
		}
		window.alert('tes');
	}

	


})