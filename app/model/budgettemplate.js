Ext.define('FamilyDecoration.model.BudgetTemplate', {
	extend: 'Ext.data.Model',
	fields: [
		{name: 'budgetTemplateId', type: 'string'},
		{name: 'budgetTemplateName', type: 'string'}
	],
	idProperty: 'budgetTemplateId'
});