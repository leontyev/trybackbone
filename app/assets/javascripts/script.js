$(function(){

	// Модель для записи в списке
	var Note = Backbone.Model.extend({

		// Значения по умолчанию
		defaults:{
			title: 'My note',
			price: 100,
			checked: false
		},

		// Функция toggle
		toggle: function(){
			this.set('checked', !this.get('checked'));
		}
	});


	// Коллекция записей
	var NoteList = Backbone.Collection.extend({

		// В которой содержатся модели записей
		model: Note,

		// Возвращает массив только выбранных записей
		getChecked: function(){
			return this.where({checked:true});
		}
	});

	// Заполнение коллекции несколькими записями
	var notes = new NoteList([
		new Note({ title: 'item 1', price: 3000}),
		new Note({ title: 'item 2', price: 400}),
		new Note({ title: 'item 3', price: 90}),
		new Note({ title: 'item 4', price: 6500})
	]);

	// Этот вью превращает модель записи в html
	var NoteView = Backbone.View.extend({
		// Элем
		tagName: 'li',

    // Какие ивенты он обрабатывает
		events:{
      // По клику выполнить функцию toogleList
			'click': 'toggleNote'
		},

		initialize: function(){

			// Установка "слушателя ивента". Ивент 'change' вызывается при
			// изменении какого-либо свойства, вроде отметки в чекбоксе.
			this.listenTo(this.model, 'change', this.render);
		},

		render: function(){

			// Генерация html из модели

			this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('title') + '" /> ' + this.model.get('title') + '<span>' + this.model.get('price') + ' rub</span>');
			this.$('input').prop('checked', this.model.get('checked'));
      
			return this;
		},
    
    // Применение функции toggle к модели
		toggleNote: function(){
			this.model.toggle();
		}
	});

	// Главный вью приложения
	var App = Backbone.View.extend({

		// Привяжем #main элемент к вью
		el: $('#main'),

		initialize: function(){

			// Кешируем селекторы
			this.total = $('#total span');
			this.list = $('#notes');
			
			// Слушаем
			this.listenTo(notes, 'change', this.render);

			
			// Создаём вью для каждой модели из коллекции
			// и добавляем их на страницу

			notes.each(function(note){

				var view = new NoteView({ model: note });
				this.list.append(view.render().el);

			}, this);	
		},

		render: function(){

			// Подсчёт общей стоимости выделенных записей

			var total = 0;

			_.each(notes.getChecked(), function(elem){
				total += elem.get('price');
			});

			// Обновление стоимости
			this.total.text(total + ' rub');

			return this;

		}

	});

	new App();

});