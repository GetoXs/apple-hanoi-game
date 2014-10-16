
//Nie ładnie tak zaglądać do kodu!

var rowHeight = 50;
var rowOffset = 265;
//tutaj się dzieje magia z inicjalizacją
function setUpApples() {
	xOffset = 0;
	[1, 2, 3].forEach(function (elem) {

		offset = 0;
		$(".row[data-basket='" + elem + "']").sort(function (a, b) {
			return parseInt($(b).data('apples')) - parseInt($(a).data('apples'));
		}).each(function () {
			$(this).css('bottom', offset);
			$(this).css('left', xOffset);
			offset += rowHeight;
		});
		xOffset += rowOffset;
	});
}
//tutaj magiczne sprawdzanie wypieków
function checkFinish() {
	var rows = filterBasket($(".row"), 3);
	if (rows.length == 5)
		return true;
	else
		return false;
}
//jakieś inkrementacje
function incrementCounter()
{
	counter = parseInt($('#counter').text());
	$('#counter').text(counter + 1);
}
//a po co to jest to sam nie wiem
function filterBasket(selector, index) {
	return selector.filter(function () {
		return $(this).data('basket') && $(this).data('basket') === index;
	});
}
//helpery dla leniwych
function getTopRow(index) {
	var rows = filterBasket($(".row"), index)
		.sort(function (a, b) {
		return a.dataset.apples - b.dataset.apples;
	})
	return rows.first();
}
//brzmi mądrze i niech tak zostanie
function popBasket(index) {
	first = getTopRow(index);
	first.animate({
		bottom: 400,
	}, 500);
	first.removeClass('row').addClass('row-floating');
}
function pushBasket(index) {
	first = getTopRow(index);
	destBottom = 0;
	if (first.length > 0)
		destBottom = parseInt(first.css('bottom')) + rowHeight;
	floating = $('.row-floating').first();
	floating.animate({
		bottom: destBottom,
		left: (index - 1) * rowOffset
	}, 500);
	floating.data('basket', index);
	floating.removeClass('row-floating').addClass('row');
}
function checkPush(index) {
	floating = $('.row-floating').first();
	first = getTopRow(index);
	if (first.length == 0)
		return true;	//for empty basket

	if (floating.data('apples') < first.data('apples'))
		return true;
	else
		return false;
}

//główna magia aplikacji w pseudokontrolerach
function actionBasket(index) {
	floating = $('.row-floating')
	if (floating.length === 0) {
		popBasket(index);
	}
	else {
		if (checkPush(index)) {
			pushBasket(index);
			incrementCounter();
			if (checkFinish()) {
				counter = parseInt($('#counter').text());
				$('#result_popup').text(counter);
				$('#additional_fail').hide();
				$('#additional_price').hide();
				$('#additional_info').hide();
				if (counter <= 31) {
					$('#additional_info').show();
				}
				if (counter <= 40) {
					$('#additional_price').show();
				}
				else {
					$('#additional_fail').show();
				}
				$('#overlay').show(400);
				$('#overlay-inner').show(400);
			}
		}
	}
}
function actionOver(index) {
	floating = $('.row-floating')
	if (floating.length > 0) {
		if (floating.first().data('basket') !== index) {
			floating.animate({
				left: (index - 1) * rowOffset
			}, {
				queue: false,
				duration: 300
			});
			floating.data('basket', index);
		}
	}
}

//jakieś prowizorki
$(document).ready(function () {
	setUpApples();
	$('.row').on('click', function () {
		actionBasket($(this).data('basket'));
	});
	$('.row').on('mouseover', function () {
		actionOver($(this).data('basket'));
	});
}
);
