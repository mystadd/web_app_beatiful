function sendTelegramMessage(selectedSpecialist, selectedServices, selectedDateTime) {
  var botToken = '7051305718:AAFslNMtJbMcjeuoEE2op9zwbjvXoHPeUfQ';
  var chatId = '-1002158957401';

  var name = $('#first_name').val();
  var telephone = $('#telephone').val();
  var email = $('#email').val();
  var message = $('#message').val();

  var FullMessage = `<b>Новая запись на прием!</b>
                    <b>Выбранный специалист:</b> ${$.trim(selectedSpecialist)}
                    <b>Выбранные услуги:</b> ${selectedServices}
                    <b>Дата и время:</b> ${selectedDateTime}
                    <b>Контактные данные:</b>
                    <b>Имя:</b> ${name}
                    <b>Телефон:</b> ${telephone}`;

                    if (email) {
                      FullMessage += `<b>E-mail:</b> ${email}`;
                    }
                  
                    if (message) {
                      FullMessage += `<b>Комментарий:</b> ${message}`;
                    }

  fetch('https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + '&text=' + encodeURIComponent(FullMessage) + '&parse_mode=HTML')
  .then(response => console.log('Уведомление успешно отправлено в Telegram', response))
  .catch(error => console.error('Ошибка при отправке уведомления в Telegram:', error));
}

$(document).ready(function() {
  var selectedDate = '';
  var selectedTime = '';

  function displaySelectedData() {
    var selectedSpecialist = $('.specialist-details.active').find('.name').text();
    var selectedSpecialistTitle = $('.specialist-details.active').find('.sp-title').text();
    var selectedSpecialistImage = $('.specialist-details.active').find('img').attr('src');

    var selectedServicesHtml = '';
    var totalPrice = 0;

    var selectedServices = [];

    $('.list-service-option input[type="checkbox"]:checked').each(function() {
      var serviceOption = $(this).closest('.list-service-option');
      var serviceName = serviceOption.find('.name__service').text();
      var serviceSubtitle = serviceOption.find('.subtitle-service').text();
      var servicePrice = parseFloat(serviceOption.find('.price').text().replace(/\s/g, ''));

      selectedServices.push({
        name: serviceName,
        subtitle: serviceSubtitle,
        price: servicePrice
      });

      totalPrice += servicePrice;
    });

    selectedServicesHtml += '<div class="selected-service-form">';
    selectedServicesHtml += '<h3>Услуги</h3>';
    for (var i = 0; i < selectedServices.length; i++) {
      selectedServicesHtml += '<div class="selected-service-block">';
      selectedServicesHtml += '<div class="service-info-block">';
      selectedServicesHtml += '<div class="name_service_title">' + selectedServices[i].name + '</div>';
      selectedServicesHtml += '<div class="name_service_subtitle">' + selectedServices[i].subtitle + '</div>';
      selectedServicesHtml += '</div>';
      selectedServicesHtml += '<div class="name_service_price">' + selectedServices[i].price.toLocaleString() + ' руб.</div>';
      selectedServicesHtml += '</div>';
    }
    selectedServicesHtml += '<div class="horizontal-line"></div>';
    selectedServicesHtml += '</div>';
    
    var selectedDate = new Date(document.getElementById('davaToday').value);

    var days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];

    var dayOfWeek = days[selectedDate.getDay()];
    var dayOfMonth = selectedDate.getDate();
    var month = months[selectedDate.getMonth()];

    var formattedDate = dayOfWeek + ", " + dayOfMonth + " " + month;

    var selectedSpecialistHtml = '<div class="sp-block-data">';
    selectedSpecialistHtml = '<div class="specialist-select">';
    selectedSpecialistHtml += '<img src="' + selectedSpecialistImage + '">';
    selectedSpecialistHtml += '<div class="sp-info-block">';
    selectedSpecialistHtml += '<div class="name_specialist">' + selectedSpecialist + '</div>';
    selectedSpecialistHtml += '<div class="sp_category">' + selectedSpecialistTitle + '</div>';
    selectedSpecialistHtml += '</div></div>';
    selectedSpecialistHtml += '<div class="horizontal-line"></div></div>';

    var selectedDateTimeHtml = '<div class="datetime-select">';
    selectedDateTimeHtml += '<img src="images/date-and-time-icon.png">';
    selectedDateTimeHtml += '<div class="datetime-info-block">';
    selectedDateTimeHtml += '<div class="date-info">' + formattedDate + '</div>';
    selectedDateTimeHtml += '<div class="time-info">' + selectedTime + '</div>';
    selectedDateTimeHtml += '</div></div>';

    selectedServicesHtml += '<div class="tb-container"><div class="total-block"><div class="total-price-title">Итого: </div>' + '<div class="total-price">' + totalPrice.toLocaleString() + ' рублей</div></div><div class="horizontal-line"></div></div>';

    $('.selected-data').html(selectedSpecialistHtml + selectedDateTimeHtml + selectedServicesHtml);
  }

  function checkDateTimeAndShowButton() {
    if (selectedDate !== '' && selectedTime !== '') {
      $('.btn-continue2').show();
    } else {
      $('.btn-continue2').hide();
    }
  }
    
  $('.form-select-time').click(function() {
    $('.form-select-time').removeClass('active');
    $(this).addClass('active');
    selectedTime = $(this).text();
    checkDateTimeAndShowButton();
  });
  
  $('.input-date').change(function() {
    selectedDate = $(this).val();
    checkDateTimeAndShowButton();
  });

  $('.btn-signup').click(function() {
    var isValid = true;


    $('.data-contacts-form input[required]').each(function() {
        if (!$(this).val()) {
            isValid = false;
            $(this).css('border-color', '#F72C32');
        } else {
            $(this).css('border-color', '');
        }
    });

    if (!isValid) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
    }

    var selectedSpecialist = $('.specialist-details.active .name').text();
    var selectedServices = [];
    $('.list-service-option input[type="checkbox"]:checked').each(function() {
        selectedServices.push($(this).closest('.list-service-option').text().trim());
    });
    var selectedDateTime = selectedDate + ' ' + selectedTime;

    sendTelegramMessage(selectedSpecialist, selectedServices.map((item)=>item.replace(/[\n\r]/g, '')).join(',').replace(/  /g, '').replace(/…/g, ''), selectedDateTime);
    
    $('.end_form').show();
    $('#popupOverlay').css({"display": "none"});
    $('.btn-home').click(function() {
      window.location.href = "index.html"; // Замените 'главная страница URL' на фактический URL вашей главной страницы
    });
  });

  $('#telephone').on('input', function() {
    var phoneNumber = $(this).val().replace(/\D/g, '');
    if (phoneNumber.length > 11) {
        phoneNumber = phoneNumber.slice(0, 11);
    }
    phoneNumber = '+' + phoneNumber;

    phoneNumber = phoneNumber.replace(/^(\+\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5');

    $(this).val(phoneNumber);
  });

  $("#openPopup").click(function() {
    $("#popupOverlay").css({"display": "block", "opacity": "1"});
  });

  $('.closePopup').click(function() {
    $('input[type="checkbox"]').prop('checked', false);
    
    $('.specialist-details').removeClass('active');
    $('.btn-continue1').hide();
  
    selectedDate = '';
    selectedTime = '';
    $('.form-select-time').removeClass('active');
    $('.input-date').val('');
    $('.btn-continue2').hide();
    
    $('.list-service-option input[type="checkbox"]').prop('checked', false);
    $('.list-service-option .cb-service').removeClass('checked');
    $('.btn-continue3').hide();
    
    $('#popupOverlay').css({"display": "none"});
    $('.open_step[data-open-step="0"]').click();
  });
  
  $('.specialist-details').click(function() {
    $('.specialist-details').removeClass('active');
    $(this).addClass('active');

    var selectedSpecialist = $(this).data('specialist');

    $('.services-container').hide();
    $('.services-container[data-specialist="' + selectedSpecialist + '"]').show();
  
    if ($('.specialist-details.active').length > 0) {
      $('.btn-continue1').show();
    } else {
      $('.btn-continue1').hide();
    }
  });

  $(".open_step").click(function() {
    let numberOpenForm = $(this).data("open-step");
    $(this).closest(".popup-box").find('*[data-step]').map(function(index, item) {
        const currentItem = $(item);
        if (currentItem.data('step') === numberOpenForm) {
            currentItem.show();
        } else {
            currentItem.hide();
        }
    });

    if (numberOpenForm === 4) {
        displaySelectedData();
    }
  });

  $('.list-service-option').click(function() {
    var checkbox = $(this).find('input[type="checkbox"]');
    var cbService = $(this).find('.cb-service');

    checkbox.prop('checked', !checkbox.prop('checked'));
    cbService.toggleClass('checked');

    if ($('.list-service-option input[type="checkbox"]:checked').length > 0) {
        $('.btn-continue3').show();
    } else {
        $('.btn-continue3').hide();
    }
  });
});


var slideIndex = 0;

function showSlides() {
    var slides = $(".mySlides");
    slides.hide();
    
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    slides.eq(slideIndex - 1).show();
    
    setTimeout(showSlides, 3000);
}

showSlides();