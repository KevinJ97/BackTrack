angular.module('BackTrack', ['angularAudioRecorder']).controller('homeController', function($scope) {

	$scope.playButton = true;
	$scope.recordButton = function recordButton() {
		if ($scope.playButton) {
			$scope.playButton = false;
			recorder.startRecord();
		} else {
			$scope.playButton = true;
			recorder.stopRecord();
		}
		console.log('Record Button Pressed');
	}



})