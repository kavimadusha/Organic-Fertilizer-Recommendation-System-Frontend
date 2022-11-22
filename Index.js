$(function () {
  loadTypes();
});

function openForm() {
  document.getElementById("popupForm").style.display = "block";
}

function closeForm() {
  document.getElementById("popupForm").style.display = "none";
}

function loadTypes() {
  var settings = {
    url: "https://organicfertilizerrecommendationsystemapi.azurewebsites.net/api/CropTypes",
    method: "GET",
    timeout: 0,
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    //cropType
    $("#cropType option").remove();
    $("#cropType").append('<option value=""></option>');
    $.each(response, function (index, value) {
      $("#cropType").append(
        '<option value="' + value.value + '">' + value.label + "</option>"
      );
    });
  });

  $("#cropType").change(function () {
    var id = this.value;

    console.log(id);
    var settings = {
      url:
        "https://organicfertilizerrecommendationsystemapi.azurewebsites.net/api/CropTypes/CropTypeAges?id=" +
        id,
      method: "GET",
      timeout: 0,
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      $("#cropAge option").remove();
      $("#cropAge").append('<option value=""></option>');
      $.each(response, function (index, value) {
        $("#cropAge").append(
          '<option value="' + value.value + '">' + value.label + "</option>"
        );
      });
    });
  });

  $("#btnSubmit").on("click", function () {
    console.log("click");

    var obj = {
      CropTypeId: setValues($('#cropType')),
      CropTypeAgeId: setValues($('#cropAge')),
      Area: setValues($('#area')),
      NContentOfSoil: setValues($('#soilN')),
      PContentOfSoil: setValues($('#soilP')),
      KContentOfSoil: setValues($('#soilK')),
      NContentOfComposte: setValues($('#compostsN')),
      PContentOfComposte: setValues($('#compostsP')),
      KContentOfComposte: setValues($('#compostsK')),
      NaturalSourceId: 1,
    }

    if(setValues($('#cropType')) == null || setValues($('#cropType')) == NaN){
      return document.getElementById("vcropType").innerHTML = "Crop Type is Required";
    }
    else{
      document.getElementById("vcropType").innerHTML = "";
    }

    if(setValues($('#cropAge')) == null || setValues($('#cropAge')) == NaN){
      return document.getElementById("vcropAge").innerHTML = "Crop Age is Required";
    }
    else{
      document.getElementById("vcropAge").innerHTML = "";
    }

    if(setValues($('#compostsN')) >  1000000 ){
      return document.getElementById("vcompostsN").innerHTML = "Max Value is 1,000,000";
    }
    else{
      document.getElementById("vcompostsN").innerHTML = "";
    }

    if(setValues($('#compostsP')) >  1000000 ){
      return document.getElementById("vcompostsP").innerHTML = "Max Value is 1,000,000";
    }
    else{
      document.getElementById("vcompostsP").innerHTML = "";
    }

    if(setValues($('#compostsK')) >  1000000 ){
      return document.getElementById("vcompostsK").innerHTML = "Max Value is 1,000,000";
    }
    else{
      document.getElementById("vcompostsK").innerHTML = "";
    }



    console.log(clean(obj));

    Object.entries(obj).forEach( o => (o[1] === NaN ? delete obj[o[0]] : 0));

    console.log(obj);

    var settings = {
      url: "https://organicfertilizerrecommendationsystemapi.azurewebsites.net/api/Recomondations",
      method: "POST",
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(clean(obj)),
    };

    $.ajax(settings).done(function (response) {

      alert("Record Submitted Successfully !");
      // swal("Title", "Message Content", "success", {
      //   button: "Ok",
      // });

      console.log(response);
      $('#resultheader').empty();

      var textType = $("#cropType option:selected").text();
      var textAge = $("#cropAge option:selected").text();
      $('#resultheader').html('Fertilizer Recommendation for '+ textType +' at the Age of '+textAge);

      $('#NPK').html(response.nValue +' (N) : '+ response.pValue +' (P) : '+ response.kValue + ' (K)');
      $('#Amount').html(response.amount.toFixed(3));

      $('#Naturaltbody').empty();

      $('#areaResult').html(setValues($('#area'))? setValues($('#area')): 1)

      console.log(response.naturalSourceAmounts.sort((a,b) => a.amount - b.amount));
      $.each(response.naturalSourceAmounts.sort((a,b) => a.amount - b.amount) , function(index, value){

        $('#Naturaltbody').append('<tr><td>'+ value.name +'</td><td>'+ value.amount.toFixed(3) +'</td></tr>');

      })

    });
  });

  function clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined || obj[propName] === NaN) {
        delete obj[propName];
      }
    }
    return obj
  }

  function setValues(element){
    var val = parseFloat(element.val());
    console.log(val);
    if (isNaN(val)) {
        //alert("Please only enter valid values.");
        return null;
    }
    else if(val == ''){
      return null;
    }
    else {
        return val;
    }
  }

  $("#btnReset").on("click", function () {

    let confirmAction = confirm("Are you sure to Reset?");
    if (confirmAction) {
    document.getElementById("myForm").reset();

    $('#NPK').html("");
    $('#Amount').html("");
    $('#Naturaltbody').html("");
    $('#areaResult').html(""); 
  } else {
      // alert("Action canceled");
    }

  });

  $("#cropType").on("change", function () {

   
    if(setValues($('#cropType')) == null || setValues($('#cropType')) == NaN){
      return document.getElementById("vcropType").innerHTML = "Crop Type is Required";
    }
    else{
      document.getElementById("vcropType").innerHTML = "";
    }    

  });

  $("#cropAge").on("change", function () {

    if(setValues($('#cropAge')) == null || setValues($('#cropAge')) == NaN){
      return document.getElementById("vcropAge").innerHTML = "Crop Age is Required";
    }
    else{
      document.getElementById("vcropAge").innerHTML = "";
    }

  });

  $("#compostsN").keyup( function () {

    if(setValues($('#compostsN')) >  1000000 ){
      return document.getElementById("vcompostsN").innerHTML = "Max Value is 1,000,000";
    }
    else{
      document.getElementById("vcompostsN").innerHTML = "";
    }

  });


  $("#compostsP").keyup( function () {

    if(setValues($('#compostsP')) >  1000000 ){
      return document.getElementById("vcompostsP").innerHTML = "Max Value is 1,000,000";
    }
    else{
      document.getElementById("vcompostsP").innerHTML = "";
    }

  });


  $("#compostsK").keyup( function () {

    if(setValues($('#compostsK')) >  1000000 ){
      return document.getElementById("vcompostsK").innerHTML = "Max Value is 1,000,000";
    }
    else{
      document.getElementById("vcompostsK").innerHTML = "";
    }

  });
  

  
  
}
