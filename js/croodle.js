DataHandler = function () {
	this.read = function (id, done, fail) {
		$.ajax({
			url: "api.php",
			type: 'GET',
			dataType: 'json',
			data: {
				id: id,
				action: 'get'
			}
		})
		.done(function(result) {
			if (result.result === true) {
				result.data.data = JSON.parse(sjcl.decrypt($(location).attr('hash').substring(1), result.data.data));
				
				for (i = 0; i < result.data.user.length; i++) {
					result.data.user[i] = JSON.parse(sjcl.decrypt($(location).attr('hash').substring(1), result.data.user[i]));
				}
				
				done(result);
			}
			else {
				console.log ('Api reported an error.');
				console.log (result.errorMsg);
				
				alert('Could not read requested data!\nerror message: ' + result.errorMsg);
			}
		})
		.fail(function(result) {
			fail(result);
		});
	};
	
	this.write = function (id, version, data, done, fail) {
		crypt_data = jQuery.extend(true, {}, data);
		
		crypt_data.data = sjcl.encrypt($(location).attr('hash').substring(1), JSON.stringify(data.data));
		for (i = 0; i < data.user.length; i++) {
			crypt_data.user[i] = sjcl.encrypt($(location).attr('hash').substring(1), JSON.stringify(data.user[i]));
		}
		
		$.ajax({
			url: 'api.php',
			type: 'POST',
			dataType: 'json',
			data: {
				id: id,
				action: 'set',
				version: version,
				data: JSON.stringify(crypt_data)
			}
		})
		.done(function(result) {
			if (result.result === true) {
				done(result);
			}
			else {
				console.log('Api reported an error.');
				console.log(result.errorMsg);
				
				alert('Could not save data:\nerror message: ' + result.errorMsg);
			}
		})
		.fail(function(result) {
			fail(result);
		});
	};
};

Poll = function (id) {
	// config
	this.passwordLength = 40;
	this.passwordChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	
	// init
	self = this;
	this.id = id;

	this.Create = function(data) {
		self.data = data;
		CreatePassword();
		Print();
		this.Save();
	};

	this.Failed = function(result) {
		console.log("Datahandler fehlgeschlagen.");
		console.log(result);
	};

	this.Load = function() {
		datahandler = new DataHandler();
		datahandler.read(self.id, this.Loaded, this.Failed);
	};
	
	this.Loaded = function(result) {
		self.version = result.version;
		self.data = result.data;

		Print();
	};
	
	this.Save = function() {
		datahandler = new DataHandler();
		datahandler.write(self.id, self.version, self.data, this.Saved, this.Failed);
	};
	
	this.Saved = function(result) {
		if (self.id !== result.id) {
			self.id = result.id;
			if (history.pushState) history.pushState({}, '', $(location).attr('pathname') + '?' + self.id + $(location).attr('hash'));
			else $(location).attr('search', '?' + self.id);
		}
		self.version = result.version;
	};
	
	function AddUser() {;
		new_user = AddUserGetData();
		self.data.user.push(new_user);
		
		self.Save();
		$('#userlist #addUser').mustache('PollUserlistUser_template', new_user, { method: 'before' });
		$('#addUser input').val('');
		
		return false; // prevent form to be submitted
	};
	
	function AddUserGetData() {
		new_user = {};
		new_user.name = $('#addUserName').val();
		new_user.selection = [];
		$.each($('#addUser .selection'), function(key, value) {
			new_user.selection.push(value.value);
		});
		return new_user;
	}
	
	function CreatePassword() {
    var chars = self.passwordChars;
		var length = self.passwordLength;
		
		var password = '';
    var list = chars.split('');
    var len = list.length, i = 0;
    do {
      i++;
      var index = Math.floor(Math.random() * len);
      password += list[index];
    
    } while(i < length);
		
		$(location).attr('hash', '#' + password);
	}
	
	function Print() {
		$('#content').mustache('Poll_template', self.data, { method: 'html' });		
		$('#addUser #addUserSave').bind('click', AddUser);
	};
};

PollAdd = function (type) {
	self = this;
	this.type = type;
	this.setTimes = false;
	
	this.CalenderChanges = function (dates) {
		// reset options
		$('#options .option').remove();
		
		// ToDo: sorting dates
		dates.sort(function(a, b) {
			if (a < b) return -1;
			if (a > b) return 1;
			return 0;
		});
		
		dates_formated = ConvertDatesToFormated(dates);
		
		// generate new options
		for (var i = 0; i < dates_formated.length; i++) {
			$('#options').mustache('PollAddOption_template', { value: dates_formated[i] });
		}
		
		// generate new times table
		if (self.setTimes) { GenerateTimesTable(dates_formated); }
	};
	
	this.init = function () {
		$('#content').mustache('PollAdd_template', {}, { method: 'html' });
		
		$('#addPollSave').bind('click', CreatePoll);
		
		switch (self.type) {
			case 'date':
				$('#calender').mustache('PollAddCalender_template', {});
				$('#calenderDatePick').datepick({
					multiSelect: 999,
					monthsToShow: 2,
					monthsToStep: 1,
					onSelect: function (dates) { self.CalenderChanges(dates); }
				});
				$('#setTimesButton').bind('click', ButtonSetTimes);
				break;
			
			case 'poll':
				// add 2 option input fields on init
				$('#options').mustache('PollAddOption_template', {});
				$('#options').mustache('PollAddOption_template', {});
				
				// add button for adding another option input field
				$('#moreOptionsButton').mustache('PollAddOptionAddButton_template', {});
				$('#addPollAddOption').bind('click', ButtonAddOption);
				break;
		};
	};
	
	function ButtonAddOption() {
		$('#options').mustache('PollAddOption_template', {});
		return false; // prevent form to be submited
	}
	
	function ButtonAddTime() {
		$('#timestable thead tr').mustache('PollAddTimesTimeHead_template', {value: 'Zeit'});
		$('#timestable tbody tr').map(function() {
			$(this).mustache('PollAddTimesTimeBody_template', { date: $(this).children('.date').text(), value: '' });
		});
		return false; // prevent form to be submited
	}
	
	function ButtonCopyTimeline() {
		for (var i = 2; i <= $('#timestable tbody tr:first td').length; i++) {
			value = $('#timestable tbody tr:first td:nth-child(' + i +') input').val();
			$('#timestable tbody tr:gt(0) td:nth-child(' + i +') input').val(value);
		}
		ChangeDateTime();
		return false; // prevent form to be submitted
	}
	
	function ButtonSetTimes() {
		self.setTimes = true;
		dates = $('#calenderDatePick').datepick('getDate');
		dates_formated = ConvertDatesToFormated(dates);
		GenerateTimesTable(dates_formated);
		return false; // prevent form to be submitted
	}
	
	function ChangeDateTime() {
		$('.option').remove();
		$('.datetime').map(function() {
			if ($(this).val() !== '') {
				// add option with datetime
				$('#options').mustache('PollAddOption_template', { value: $(this).attr('data-date') + " " + $(this).val() });
			}
		});
	}
	
	function ConvertDatesToFormated(dates) {
		dates_formated = [];
		for (var i = 0; i < dates.length; i++) {
			dates_formated.push($.datepick.formatDate(dates[i]));
		}
		return dates_formated;
	}
	
	function CreatePoll() {
		new_poll = CreatePollGetData();
		
		// check for atleast two options
		if (new_poll.data.options.length < 2) {
			alert ('You have to add at least two options / dates.');
			return false; // prevent form to be submitted
		}
		
		// create new poll
		poll = new Poll('');
		poll.Create(new_poll);
		
		return false; // prevent form to be submitted
	}
	
	function CreatePollGetData() {
		new_poll = {};
		new_poll.head = {};
		new_poll.data = {};
		new_poll.data.options = [];
		new_poll.data.title = $('#addPollTitle').val();
		new_poll.data.description = $('#addPollDescription').val();
		switch ($('#addPollAnswertype').val()) {
			case 'YesNo':
				new_poll.data.answers = ['yes', 'no'];
				break;
				
			case 'YesNoMaybe':
				new_poll.data.answers = ['yes', 'maybe', 'no'];
				break;
				
			case 'Text':
				new_poll.data.answers = [];
				break;
		}
		$.each($('#addPoll .option'), function(key, value){
			if (value.value !== '') { new_poll.data.options.push(value.value); }
		});
		new_poll.user = [];
		return new_poll;
	}
	
	function GenerateTimesTable(dates_formated) {
		// keep old data
		count = $('#timestable thead tr td').length - 1;
		if (count === -1) count = 3;
		
		dates_values = [];
		for (var i = 0; i < dates_formated.length; i++) {
			values = [];
			if ($('.datetime[data-date="' + dates_formated[i] + '"]').length > 0) {
				$('.datetime[data-date="' + dates_formated[i] + '"]').map(function() {
					values.push({
						date: dates_formated[i],
						value: $(this).val()
					});
				});
			}
			else {
				for (var g = 0; g < count; g++) {
					values.push({
						date: dates_formated[i],
						value: ''
					});
				}
			}
			dates_values.push({
				date: dates_formated[i],
				values: values
			});
		}
		
		identifier = [{value: 'date'}];
		for (var g = 0; g < count; g++) {
			identifier.push({
				value: 'time '
			});
		}
		
		// generate new table
		$('#times').mustache('PollAddTimes_template', { identifier: identifier, dates: dates_values }, { method: 'html'});
		$('#timesMoreButton').bind('click', ButtonAddTime);
		$('#timesCopyTimelineButton').bind('click', ButtonCopyTimeline);
		$('.datetime').bind('change', ChangeDateTime);
	}
};

function Startpage() {
	this.init = function() {
		$('#content').mustache('Startpage_template', {}, { method: 'html' });
		$('#FindADate-Button').bind('click', CreateNewPollDate);
		$('#MakeAPoll-Button').bind('click', CreateNewPollPoll);
	};
	
	function CreateNewPoll(type) {
		poll_add = new PollAdd(type);
		poll_add.init();
	};
	
	function CreateNewPollDate() {
		CreateNewPoll('date');
	}
	
	function CreateNewPollPoll() {
		CreateNewPoll('poll');
	}
};

// reading templates
$.Mustache.addFromDom();

id = $(location).attr('search').substring(1);
password = $(location).attr('hash').substring(1);
if (id !== '' && password !== '') {
	// show existing poll
	poll = new Poll(id);
	poll.Load();
}
else {
	page = new Startpage();
	page.init();
}