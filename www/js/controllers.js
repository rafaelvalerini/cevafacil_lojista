angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout,  $location, $ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  //--------------------------------------------
   $scope.login = function(user) {
			
		if(typeof(user)=='undefined'){
			$scope.showAlert('Please fill username and password to proceed.');	
			return false;
		}

		if(user.username=='demo@gmail.com' && user.password=='demo'){
			$location.path('/app/dashboard');
		}else{
			$scope.showAlert('Invalid username or password.');	
		}
		
	};
  //--------------------------------------------
  $scope.logout = function() {   $location.path('/app/login');   };
  //--------------------------------------------
   // An alert dialog
	 $scope.showAlert = function(msg) {
	   var alertPopup = $ionicPopup.alert({
		 title: 'Warning Message',
		 template: msg
	   });
	 };
  //--------------------------------------------
})


.controller('TypesCtrl', function($scope, $stateParams , $window, Profiles, Meet) {
	
	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

	$scope.result = Profiles.get($stateParams.brand);	

	$scope.id = $stateParams.id;
	
	$scope.brand = $stateParams.brand;

	var jsonObject = JSON.parse(window.localStorage['companyLogin']);

	for (var i = $scope.result.sizes.length - 1; i >= 0; i--) {

		for (var j = jsonObject.Types.length - 1; j >= 0; j--){

			if(parseInt($scope.id) === parseInt(jsonObject.Types[j].Type) &&
				parseInt($scope.brand) === parseInt(jsonObject.Types[j].Brand) && 
				parseInt(jsonObject.Types[j].Size) === parseInt($scope.result.sizes[i].id)){

				$scope.result.sizes[i].value = jsonObject.Types[j].Value;

			}

		} 

	}

	$scope.goBack = function(){
		window.history.go(-1);
	}

})

.controller('LogoutCtrl', function($scope, $stateParams) {

	

	window.localStorage['companyLogin'] = '';	

})

.controller('TypeHomeCtrl', function($scope, $stateParams , $window, Beer) {

	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

	if($stateParams.id == 1){

		$scope.result = Beer.all();	

	}

	$scope.id = $stateParams.id;

	$window.navigator.geolocation.getCurrentPosition(function(position) {
  
    	$scope.$apply(function() {
  
      		window.localStorage['lat'] = position.coords.latitude;
  
      		window.localStorage['lng'] = position.coords.longitude;

    	})

  	})

  	if(!window.localStorage['lat']){
		window.localStorage['lat'] = -20.5477575;
	}

	
	if(!window.localStorage['lng']){
		window.localStorage['lng'] = -47.4189357;
	}

	$scope.goBack = function(){
		window.history.go(-1);
	}

})

.controller('ResultCtrl', function($scope, $ionicLoading, $ionicPopup, $stateParams, $http, $window, Profiles, Meet) {
	
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

	$ionicLoading.show({
	    content: 'Carregando...',
		animation: 'fade-in',
		noBackdrop: false
	});

	$scope.id = $stateParams.id;

	$scope.size = $stateParams.size;

	$scope.brand = $stateParams.brand;

	 if($stateParams.id == 1){

    	$scope.result = Profiles.getSize($stateParams.brand, $stateParams.size);
    	
    }else{

    	for (var i = Meet.get($stateParams.brand).types.length - 1; i >= 0; i--) {
    		
    		if(Meet.get($stateParams.brand).types[i].id == $stateParams.size){

    			$scope.result = Meet.get($stateParams.brand).types[i];

    			break;

    		}
    		
    	}

    }

	var jsonObject = JSON.parse(window.localStorage['companyLogin']);

	for (var j = jsonObject.Types.length - 1; j >= 0; j--){

		if(parseInt(jsonObject.Types[j].Type) === parseInt($stateParams.id) &&
			parseInt($scope.brand) === parseInt(jsonObject.Types[j].Brand) && 
				parseInt(jsonObject.Types[j].Size) === parseInt($scope.result.id)){

			$scope.result.value = jsonObject.Types[j].Value;

			$scope.result.valueFloat = parseFloat($scope.result.value.replace('R$','').replace(',','.'));

		}

	} 


	$ionicLoading.hide();

	$scope.goBack = function(){
		window.history.go(-1);
	}

	$scope.save = function(){
		
		$ionicLoading.show({
		    content: 'Carregando...',
			animation: 'fade-in',
			noBackdrop: false
		});

		$http.post('http://52.87.63.135:7001/company/'+JSON.parse(window.localStorage['companyLogin']).Id + 
			'/type/'+$stateParams.id+'/brand/'+$stateParams.brand+'/size/'+$stateParams.size+'/value/'+ document.getElementById('inputNumber').value+ '/token/'+Base64.encode('' + new Date().getTime()))
		
			.then(function(resp) {

		  		var jsonObject = JSON.parse(window.localStorage['companyLogin']);

		  		var Beers = [];

		  		var exists = false;

				for (var j = jsonObject.Types.length - 1; j >= 0; j--){

					if(parseInt($scope.id) == parseInt(jsonObject.Types[j].Type) && 
						parseInt($scope.brand) == parseInt(jsonObject.Types[j].Brand) && 
						parseInt(jsonObject.Types[j].Size) == parseInt($scope.result.id)){

						exists = true;

						$scope.result = '';

						var beerEntity = {Type: jsonObject.Types[j].Type, Brand: jsonObject.Types[j].Brand, Value: resp.data.Value, Size: jsonObject.Types[j].Size};

						Beers.push(beerEntity);

					}else{

						Beers.push(jsonObject.Types[j]);

					}

				} 

				if(!exists){
					Beers.push({Type: parseInt($scope.id),Brand: parseInt($scope.brand), Value: resp.data.Value, Size: parseInt($scope.size)});
				}

				jsonObject.Types = Beers;

				window.localStorage['companyLogin'] = JSON.stringify(jsonObject);

				$ionicLoading.hide();

				if($scope.id == 1){
					$window.location.href = '#/app/type/'+$scope.id+'/brand/'+$scope.brand;
				}else{
					$window.location.href = '#/app/meet/'+$scope.brand;
				}

				//$window.location.reload();

			}, function(err) {

				$ionicLoading.hide();

				$ionicPopup.alert({
				    title: 'Falha ao salvar informações',
				    template: 'Verifique sua conexão com a internet e tente novamente.'
				});

			})

	}

})

.controller('DashBoardCtrl', function($scope, $ionicLoading, $stateParams, $http, $ionicPopup, $window, $timeout, Profiles) {
	
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

	$ionicLoading.show({
		    content: 'Carregando...',
			animation: 'fade-in',
			noBackdrop: false
		});

	$scope.result = JSON.parse(window.localStorage['companyLogin']);

	$ionicLoading.hide();

	$scope.goBack = function(){
		
		window.history.go(-1);

	}

  	$scope.save = function() {
    
    	$ionicLoading.show({
		    content: 'Carregando...',
			animation: 'fade-in',
			noBackdrop: false
		});

    	$http({
	        url: 'http://52.87.63.135:7001/company/'+$scope.result.Id+ '/token/'+Base64.encode('' + new Date().getTime()),
	        method: "POST",
	        data: JSON.stringify($scope.result)
       		 }).then(function(resp) {

			    if(!resp.data){

		  			$ionicLoading.hide();

		  			$ionicPopup.alert({
				       title: 'Falha ao salvar',
				       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
				    });

		  		}else{

		  			window.localStorage['companyLogin'] = JSON.stringify($scope.result);

		  			$ionicLoading.hide();

		  			$ionicPopup.alert({
				       title: 'Mensagem de sucesso',
				       template: 'Registro salvo com sucesso.'
				    });

		  			$timeout( 
		  				function(){ 
		  					$window.location.href = '#/app/initial';
							//$window.location.reload();
		  				}, 
		  				3000);
		  		}

			}, function(err) {

				$ionicLoading.hide();

				$ionicPopup.alert({
				       title: 'Falha ao salvar',
				       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
				    });

			    console.error('ERR', err);

			})

  	
  	};

})

.controller('LocationCtrl', function($scope, $window, $timeout, $http, $ionicPopup, $ionicLoading) {
  
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

	$scope.result = JSON.parse(window.localStorage['companyLogin']);

  	$scope.navigate = function(){

  		$ionicLoading.show({
		    content: 'Carregando...',
			animation: 'fade-in',
			noBackdrop: false
		});
  		
	  	$window.navigator.geolocation.getCurrentPosition(
	  		function(position) {
	  
		    	$scope.$apply(function() {
		  
		      		window.localStorage['lat'] = position.coords.latitude;
		  
		      		window.localStorage['lng'] = position.coords.longitude;

		      		$http.post('http://52.87.63.135:7001/company/'+JSON.parse(window.localStorage['companyLogin']).Id + 
						'/lat/'+window.localStorage['lat']+'/lng/'+window.localStorage['lng'] + '/token/'+Base64.encode('' + new Date().getTime()))
					
						.then(function(resp) {

							$ionicLoading.hide();

							$ionicPopup.alert({
						       title: 'Mensagem de sucesso',
						       template: 'Localização atualizada com sucesso.'
						    });

				  			$timeout( 
				  				function(){ 
				  					$window.location.href = '#/app/initial';
									//$window.location.reload();
				  				}, 
				  				2000);

						}, function(err) {

							$ionicLoading.hide();

							$ionicPopup.alert({
							    title: 'Falha ao salvar informações',
							    template: 'Verifique sua conexão com a internet e tente novamente.'
							});

						    console.error('ERR', err);

						})

		    	})

		  	}, function(error) {
            	$ionicPopup.alert({
				       title: 'Falha ao gravar localização',
				       template: 'Verifique se o GPS do seu aparelho está ligado e tente novamente' 
				});
        
        	}
        );

	  	if(!window.localStorage['lat']){
			window.localStorage['lat'] = -20.5477575;
		}

		
		if(!window.localStorage['lat']){
			window.localStorage['lat'] = -20.5477575;
		}
  	}
})

.controller('HomeCtrl', function($scope, $window, $ionicSideMenuDelegate) {
  
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

  	$scope.openPopup = function(){
		$ionicPopup.alert({
		       title: 'Termo de Uso',
		       templateUrl: 'termodeuso.html'
		    });

	}

  	$scope.toggleLeft = function() {
	    $ionicSideMenuDelegate.toggleLeft();
	};

})

.controller('LoginCtrl', function($scope, $window, $ionicPopup, $location, $http, $window, $ionicLoading) {
  
	

	if(window.localStorage['companyLogin'] && window.localStorage['companyLogin'] != ''){

		$location.path('/app/initial');

	}

  	$scope.login = function(){

  		$ionicLoading.show({
		    content: 'Carregando...',
			animation: 'fade-in',
			noBackdrop: false
		});

  		if(!$scope.username|| !$scope.password){

  			$ionicLoading.hide();

  			$ionicPopup.alert({
		       title: 'Falha no login',
		       template: 'Usuário ou senha inválida.'
		    });

  		}else{

  			$http.get('http://52.87.63.135:7001/user/'+$scope.username+'/password/'+md5($scope.password) + '/token/'+Base64.encode('' + new Date().getTime()))
		
			.then(function(resp) {

				    if(!resp.data){

			  			$ionicLoading.hide();

			  			$ionicPopup.alert({
					       title: 'Falha no login',
					       template: 'Usuário ou senha inválida.'
					    });

			  		}else{

			  			$ionicLoading.hide();

			  			window.localStorage['companyLogin'] = JSON.stringify(resp.data);

						$scope.result = JSON.stringify(resp.data);

						$scope.status = resp.data.Contract;

						$location.path('/app/initial');

			  		}

				}, function(err) {

					$ionicLoading.hide();

					$ionicPopup.alert({
					       title: 'Falha no login',
					       template: 'Usuário ou senha inválida.'
					    });

				    console.error('ERR', err);

				});

		
  		} 

  	}

  	$ionicLoading.hide();
})

.controller('TypesMeetCtrl', function($scope, $ionicLoading, $window, $stateParams, Meet) {
  
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

  	$ionicLoading.show({
	    template: '<i class="icon ion-loading-d" style="font-size: 32px"></i>',
		animation: 'fade-in',
		noBackdrop: false
	});

	var post = JSON.parse(window.localStorage['companyLogin'] || '[{}]');

	$scope.types = Meet.get($stateParams.id);

	$scope.id = $stateParams.id;

	for (var i = $scope.types.types.length - 1; i >= 0; i--) {

		for (var j = post.Types.length - 1; j >= 0; j--){

			if(2 === parseInt(post.Types[j].Type) &&
				parseInt($scope.id) === parseInt(post.Types[j].Brand) && 
				parseInt(post.Types[j].Size) === parseInt($scope.types.types[i].id)){

				$scope.types.types[i].value = post.Types[j].Value;

			}

		} 

	}

	$ionicLoading.hide();

	$scope.goBack = function(){
		window.history.go(-1);
	}

})

.controller('HomeMeetCtrl', function($scope, $window, $ionicLoading, Meet) {
  
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

  	$ionicLoading.show({
	    template: '<i class="icon ion-loading-d" style="font-size: 32px"></i>',
		animation: 'fade-in',
		noBackdrop: false
	});

	$ionicLoading.hide();

	$scope.goBack = function(){
		window.history.go(-1);
	}

})

.controller('TermOfUseCtrl', function($scope, $window, $ionicLoading, $ionicPopup) {
  
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

  	$ionicLoading.show({
	    template: '<i class="icon ion-loading-d" style="font-size: 32px"></i>',
		animation: 'fade-in',
		noBackdrop: false
	});

	$ionicLoading.hide();

		$scope.openPopup = function(){
			$ionicPopup.alert({
			       title: 'Termo de Uso',
			       templateUrl: 'termodeuso.html'
			    });

		}

})

.controller('NewCompanyCtrl', function($scope, $location,$http, $ionicPopup, $timeout, $window, $ionicLoading) {
  
  	$ionicLoading.show({
	    template: '<i class="icon ion-loading-d" style="font-size: 32px"></i>',
		animation: 'fade-in',
		noBackdrop: false
	});

  	$scope.result = {Name : '', User: '', Password: ''};

	$ionicLoading.hide();

	$scope.openPopup = function(){
		$ionicPopup.alert({
		       title: 'Termo de Uso',
		       templateUrl: 'termodeuso.html'
		    });
	}

	$scope.save = function(){

		if(!$scope.result.Name || !$scope.result.User || !$scope.result.Password || !$scope.result.TermoDeUso){
			$ionicPopup.alert({
		       title: 'Mensagem de Erro',
		       template: 'Preenche todos os campos e tente novamente.'
		    });
		}else{

			$scope.result.Password = md5($scope.result.Password);

			$http({
		        url: 'http://52.87.63.135:7001/create/token/'+Base64.encode('' + new Date().getTime()),
		        method: "POST",
		        data: JSON.stringify($scope.result)
	       		 }).then(function(resp) {

				    if(!resp.data){

			  			$ionicLoading.hide();

			  			$ionicPopup.alert({
					       title: 'Falha ao salvar',
					       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
					    });

			  		}else{

			  			$ionicLoading.hide();

	  					$window.location.href = '#/app/company/signature';
						//$window.location.reload();
			  		}

				}, function(err) {

					$ionicLoading.hide();

					$ionicPopup.alert({
					       title: 'Falha ao salvar',
					       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
					    });

				    console.error('ERR', err);

				})

	     }

	}

	$scope.goBack = function(){
		window.history.go(-1);
	}

})

.controller('CupomCtrl', function($scope, $location, $http, $window, $ionicLoading, $ionicPopup) {
  
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

  	$ionicLoading.show({
	    template: '<i class="icon ion-loading-d" style="font-size: 32px"></i>',
		animation: 'fade-in',
		noBackdrop: false
	});

  	var jsonObject = JSON.parse(window.localStorage['companyLogin']);

  	if(jsonObject.Contract != 1){
  		$ionicLoading.hide();
  		
  		$ionicPopup.alert({
			       title: 'Plano Premium',
			       template: 'Para cadastro de cupons é necessário ter o plano PREMIUM. Entre em contato com a FuturoClick que atualizamos seu plano.'
			    });
  	}else{

	  	$http.get('http://52.87.63.135:7001/company/'+jsonObject.Id+'/cupom').then(function(resp) {

			    if(!resp.data){

		  			$ionicLoading.hide();

		  			$scope.cupons = [];

		  			window.localStorage['cupons'] = JSON.stringify($scope.cupons);

		  			$ionicPopup.alert({
				       title: 'Cupom',
				       template: 'Nenhum cupom foi encontrado para sua empresa'
				    });

		  		}else{

		  			$ionicLoading.hide();

		  			$scope.cupons = resp.data;

		  			window.localStorage['cupons'] = JSON.stringify($scope.cupons);

		  		}

		  		$scope.lenghtCupons5 = $scope.cupons.length < 5;

			}, function(err) {

				$ionicLoading.hide();

				$ionicPopup.alert({
				       title: 'Erro inesperado',
				       template: 'Falha ao consultar cupons.'
				    });

			    console.error('ERR', err);

			})
	}

	$scope.goBack = function(){
		window.history.go(-1);
	}

})

.controller('AlterCupomCtrl', function($scope, $location, $http, $stateParams, $ionicPopup, $window, $ionicLoading) {
  
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

	var cupons = JSON.parse(window.localStorage['cupons']);

	$scope.cupom = {
		Code: '',
		Description: ''
	};

	for (var i = cupons.length - 1; i >= 0; i--) {
		if(cupons[i].Code == $stateParams.cupomId){
			$scope.cupom = cupons[i];
			break;
		}
	}

	// A confirm dialog
 $scope.showConfirm = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Deletar Cupom',
     template: 'Deseja realmente excluir o cupom?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $ionicLoading.show({
		    template: '<i class="icon ion-loading-d" style="font-size: 32px"></i>',
			animation: 'fade-in',
			noBackdrop: false
		});

		if($scope.cupom.Code == '' || $scope.cupom.Description == ''){
			$ionicLoading.hide();

			$ionicPopup.alert({
				       title: 'Campo Inválido',
				       template: 'Preencha corretamente os campos e tente novamente'
				    });

		}else{

			var jsonObject = JSON.parse(window.localStorage['companyLogin']);

			$http({
		        url: 'http://52.87.63.135:7001/delete/company/'+jsonObject.Id+'/cupom/'+$scope.cupom.Code+'/token/'+Base64.encode('' + new Date().getTime()),
		        method: "POST",
		        data: JSON.stringify($scope.cupom)
	       		 }).then(function(resp) {

				    if(!resp.data){

			  			$ionicLoading.hide();

			  			$ionicPopup.alert({
					       title: 'Falha ao salvar',
					       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
					    });

			  		}else{

			  			$ionicLoading.hide();

	  					$window.location.href = '#/app/cupons';
	  					
						//$window.location.reload();
			  		}

				}, function(err) {

					$ionicLoading.hide();

					$ionicPopup.alert({
					       title: 'Falha ao salvar',
					       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
					    });

				    console.error('ERR', err);

				})

		}
     } 
   });
 };

	$scope.save = function(){
		
		$ionicLoading.show({
		    template: '<i class="icon ion-loading-d" style="font-size: 32px"></i>',
			animation: 'fade-in',
			noBackdrop: false
		});

		if($scope.cupom.Description == ''){
			$ionicLoading.hide();

			$ionicPopup.alert({
				       title: 'Campo Inválido',
				       template: 'Preencha corretamente os campos e tente novamente'
				    });

		}else{

			var jsonObject = JSON.parse(window.localStorage['companyLogin']);

			$http({
		        url: 'http://52.87.63.135:7001/insert/company/'+jsonObject.Id+'/cupom/'+$scope.cupom.Code+'/token/'+Base64.encode('' + new Date().getTime()),
		        method: "POST",
		        data: JSON.stringify($scope.cupom)
	       		 }).then(function(resp) {

				    if(!resp.data){

			  			$ionicLoading.hide();

			  			$ionicPopup.alert({
					       title: 'Falha ao salvar',
					       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
					    });

			  		}else{

			  			$ionicLoading.hide();

	  					$window.location.href = '#/app/cupons';

						//$window.location.reload();
			  		}

				}, function(err) {

					$ionicLoading.hide();

					$ionicPopup.alert({
					       title: 'Falha ao salvar',
					       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
					    });

				    console.error('ERR', err);

				})

		}

	}

	$scope.goBack = function(){
		window.history.go(-1);
	}

})

.controller('NewCupomCtrl', function($scope, $location, $http, $ionicPopup, $window, $ionicLoading) {
  
	

	if(!window.localStorage['companyLogin'] || window.localStorage['companyLogin'] == [] || window.localStorage['companyLogin'] == '' || window.localStorage['companyLogin'] == {}){
		$window.location.href = '#/app/logout';
		$window.location.reload();
	}

	$scope.cupom = {
		Code: '',
		Description: ''
	};

	$scope.save = function(){
		
		$ionicLoading.show({
		    template: '<i class="icon ion-loading-d" style="font-size: 32px"></i>',
			animation: 'fade-in',
			noBackdrop: false
		});

		if($scope.cupom.Code == '' || $scope.cupom.Description == ''){
			$ionicLoading.hide();

			$ionicPopup.alert({
				       title: 'Campo Inválido',
				       template: 'Preencha corretamente os campos e tente novamente'
				    });

		}else{

			var jsonObject = JSON.parse(window.localStorage['companyLogin']);

			$http({
		        url: 'http://52.87.63.135:7001/company/'+jsonObject.Id+'/cupom/token/'+Base64.encode('' + new Date().getTime()),
		        method: "POST",
		        data: JSON.stringify($scope.cupom)
	       		 }).then(function(resp) {

				    if(!resp.data){

			  			$ionicLoading.hide();

			  			$ionicPopup.alert({
					       title: 'Falha ao salvar',
					       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
					    });

			  		}else{

			  			$ionicLoading.hide();

	  					$window.location.href = '#/app/cupons';
						//$window.location.reload();
			  		}

				}, function(err) {

					$ionicLoading.hide();

					$ionicPopup.alert({
					       title: 'Falha ao salvar',
					       template: 'Houve uma falha ao salvar as informações. Tente novamente mais tarde.'
					    });

				    console.error('ERR', err);

				})

		}

	}

	$scope.goBack = function(){
		window.history.go(-1);
	}

})
.controller('SignatureCtrl', function($scope, $location, $window, $ionicLoading) {

  	$ionicLoading.show({
	    template: '<i class="icon ion-loading-d" style="font-size: 32px"></i>',
		animation: 'fade-in',
		noBackdrop: false
	});

	$ionicLoading.hide();

	$scope.goBack = function(){
		window.history.go(-1);
	}

});

