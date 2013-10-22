function DataHandler () {
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
				result.data = JSON.parse(sjcl.decrypt($(location).attr('hash').substring(1), result.data));
				done(result);
			}
			else {
				console.log ('Api hat einen Fehler gemeldet.');
				console.log (result.errorMsg);
			}
		})
		.fail(function(result) {
			fail(result);
		});
	};
	
	this.write = function (id, version, data, done, fail) {
		$.ajax({
			url: 'api.php',
			type: 'POST',
			dataType: 'json',
			data: {
				id: id,
				action: 'set',
				version: version,
				data: sjcl.encrypt($(location).attr('hash').substring(1), JSON.stringify(data))
			}
		})
		.done(function(result) {
			if (result.result === true) {
				done(result);
			}
			else {
				console.log('Api hat einen Fehler gemeldet.');
				console.log(result.errorMsg);
			}
		})
		.fail(function(result) {
			fail(result)
		});
	};
};

function Schedule (id) {
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
		datahandler.write(self.id, self.version, self.data, this.Saved, this.Failed)
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
		new_user = AddUserGetDataByForm();
		self.data.user.push(new_user);
		
		console.log(self.data);
		
		self.Save();
		$('#userlist #addUser').mustache('ScheduleUserlistUser_template', new_user, { method: 'before' });
		$('#addUserForm')[0].reset();
		
		return false; // prevent form to be submitted
	};
	
	function AddUserGetDataByForm() {
		form = $('#addUserForm').serializeArray();
		new_user = {};
		new_user.selection = [];
		$.each(form, function(key, value){
			if (value.name === 'name') { new_user.name = value.value; }
			else { new_user.selection.push(value.value); }
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
		$('#content').mustache('Schedule_template', self.data, { method: 'html' });		
		$('#addUserForm').bind('submit', AddUser);
	};
};

function ScheduleAdd(type) {
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
			$('#options').mustache('ScheduleAddOption_template', { value: dates_formated[i] });
		}
		
		// generate new times table
		if (self.setTimes) { GenerateTimesTable(dates_formated); }
	};
	
	this.init = function () {
		$('#content').mustache('ScheduleAdd_template', {}, { method: 'html' });
		
		$('#addScheduleForm').bind('submit', CreateSchedule);
		
		switch (self.type) {
			case 'date':
				$('#calender').mustache('ScheduleAddCalender_template', {});
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
				$('#options').mustache('ScheduleAddOption_template', {});
				$('#options').mustache('ScheduleAddOption_template', {});
				
				// add button for adding another option input field
				$('#moreOptionsButton').mustache('ScheduleAddOptionAddButton_template', {});
				$('#addScheduleAddOption').bind('click', ButtonAddOption);
				break;
		};
	};
	
	function ButtonAddOption() {
		$('#options').mustache('ScheduleAddOption_template', {});
		return false; // prevent form to be submited
	}
	
	function ButtonAddTime() {
		$('#timestable thead tr').mustache('ScheduleAddTimesTimeHead_template', {value: 'Zeit'});
		$('#timestable tbody tr').map(function() {
			$(this).mustache('ScheduleAddTimesTimeBody_template', { date: $(this).children('.date').text(), value: '' });
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
				$('#options').mustache('ScheduleAddOption_template', { value: $(this).attr('data-date') + " " + $(this).val() });
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
	
	function CreateSchedule() {
		new_schedule = CreateScheduleGetDataByForm();
		
		// check for atleast two options
		if (new_schedule.options.length < 2) {
			alert ('You have to add at least two options / dates.');
			return false; // prevent form to be submitted
		}
		
		// create new schedule
		schedule = new Schedule('');
		schedule.Create(new_schedule);
		
		return false; // prevent form to be submitted
	}
	
	function CreateScheduleGetDataByForm() {
		form = $('#addScheduleForm').serializeArray();
		new_schedule = {};
		new_schedule.options = [];
		$.each(form, function(key, value){
			switch (value.name) {
				case 'title':
					new_schedule.title = value.value;
					break;
				
				case 'description':
					new_schedule.description = value.value;
					break;
					
				case 'option':
					if (value.value !== '') { new_schedule.options.push(value.value); }
					break;
			}
		});
		new_schedule.user = [];
		return new_schedule;
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
		
		identifier = [{value: 'Datum'}];
		for (var g = 0; g < count; g++) {
			identifier.push({
				value: 'Zeit '
			});
		}
		
		// generate new table
		$('#times').mustache('ScheduleAddTimes_template', { identifier: identifier, dates: dates_values }, { method: 'html'});
		$('#timesMoreButton').bind('click', ButtonAddTime);
		$('#timesCopyTimelineButton').bind('click', ButtonCopyTimeline);
		$('.datetime').bind('change', ChangeDateTime);
	}
}

function Startpage() {
	this.init = function() {
		$('#content').mustache('Startpage_template', {}, { method: 'html' });
		$('#FindADate-Button').bind('click', CreateNewScheduleDate);
		$('#MakeAPoll-Button').bind('click', CreateNewSchedulePoll);
	};
	
	function CreateNewSchedule(type) {
		schedule_add = new ScheduleAdd(type);
		schedule_add.init();
	};
	
	function CreateNewScheduleDate() {
		CreateNewSchedule('date');
	}
	
	function CreateNewSchedulePoll() {
		CreateNewSchedule('poll');
	}
}

// reading templates
$.Mustache.addFromDom();

id = $(location).attr('search').substring(1);
password = $(location).attr('hash').substring(1)
if (id !== '' && password !== '') {
	// show existing schedule
	schedule = new Schedule(id);
	schedule.Load();
}
else {
	page = new Startpage();
	page.init();
}