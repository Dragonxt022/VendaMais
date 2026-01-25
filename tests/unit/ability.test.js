const { defineAbilitiesFor } = require('../../utils/ability');
const { subject } = require('@casl/ability');

describe('CASL Abilities', () => {
  const company_id = 1;
  const other_company_id = 2;

  describe('Admin Role', () => {
    const adminUser = { role: 'admin' };
    const ability = defineAbilitiesFor(adminUser);

    it('should allow managing anything', () => {
      expect(ability.can('manage', 'all')).toBe(true);
      expect(ability.can('manage', 'Product')).toBe(true);
      expect(ability.can('manage', 'User')).toBe(true);
    });
  });

  describe('Gerente Role', () => {
    const gerenteUser = { role: 'gerente', company_id };
    const ability = defineAbilitiesFor(gerenteUser);

    it('should allow managing everything within their company', () => {
      expect(ability.can('manage', subject('Product', { company_id }))).toBe(true);
      expect(ability.can('manage', subject('StockMovement', { company_id }))).toBe(true);
    });

    it('should NOT allow managing things in other companies', () => {
      expect(ability.can('manage', subject('Product', { company_id: other_company_id }))).toBe(false);
    });

    it('should NOT allow managing GlobalProduct', () => {
      expect(ability.can('manage', 'GlobalProduct')).toBe(false);
    });

    it('should allow reading GlobalProduct', () => {
      expect(ability.can('read', 'GlobalProduct')).toBe(true);
    });
  });

  describe('Colaborador Role', () => {
    const colaboradorUser = { role: 'colaborador', company_id, id: 10 };
    const ability = defineAbilitiesFor(colaboradorUser);

    it('should allow managing products and operational data within company', () => {
      expect(ability.can('manage', subject('Product', { company_id }))).toBe(true);
      expect(ability.can('manage', subject('StockMovement', { company_id }))).toBe(true);
    });

    it('should NOT allow managing company settings', () => {
      expect(ability.can('manage', 'Company')).toBe(false);
      expect(ability.can('update', 'Company')).toBe(false);
    });

    it('should NOT allow managing users', () => {
      expect(ability.can('manage', 'User')).toBe(false);
    });

    it('should allow reading own profile', () => {
      expect(ability.can('read', subject('User', { id: 10 }))).toBe(true);
      expect(ability.can('read', subject('User', { id: 11 }))).toBe(false);
    });

    it('should allow reading company info', () => {
      expect(ability.can('read', subject('Company', { id: company_id }))).toBe(true);
    });
  });

  describe('Usuario Role', () => {
    const usuarioUser = { role: 'usuario', company_id };
    const ability = defineAbilitiesFor(usuarioUser);

    it('should allow reading products within company', () => {
      expect(ability.can('read', subject('Product', { company_id }))).toBe(true);
    });

    it('should NOT allow managing anything', () => {
      expect(ability.can('manage', 'all')).toBe(false);
      expect(ability.can('update', subject('Product', { company_id }))).toBe(false);
    });
  });

  describe('Unauthenticated User', () => {
    const ability = defineAbilitiesFor(null);

    it('should NOT allow anything', () => {
      expect(ability.can('read', 'Product')).toBe(false);
      expect(ability.can('manage', 'all')).toBe(false);
    });
  });
});


