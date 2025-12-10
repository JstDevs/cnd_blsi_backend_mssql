const { Check } = require('../config/database');
const db=require('../config/database');
const { getAllWithAssociations } = require('../models/associatedDependency');


exports.create = async (req, res) => {
  try {
    const { Status, LinkID, DisbursementID, BankID, SignatoryType, AccountNumber, AccountName, CheckNumber, BRSTN, CheckDate, Payee, Amount, Words, SignatoryOneID, SignatoryTwoID, Remarks, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, ApprovalProgress, ApprovalVersion } = req.body;
    const amountinwords=convertAmountToWords(Amount);
    const item = await Check.create({ Status, LinkID, DisbursementID, BankID, SignatoryType, AccountNumber, AccountName, CheckNumber, BRSTN, CheckDate, Payee, Amount, Words:amountinwords, SignatoryOneID, SignatoryTwoID, Remarks, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, ApprovalProgress, ApprovalVersion });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const items = await getAllWithAssociations(Check);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Check.findByPk(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: "check not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
function convertAmountToWords(amount) {
  const numberToWords = require('number-to-words');
  const whole = Math.floor(amount);
  const fraction = Math.round((amount % 1) * 100);
  return `${numberToWords.toWords(whole)} and ${fraction}/100`;
}

exports.update = async (req, res) => {
  try {
    const { Status, LinkID, DisbursementID, BankID, SignatoryType, AccountNumber, AccountName, CheckNumber, BRSTN, CheckDate, Payee, Amount, Words, SignatoryOneID, SignatoryTwoID, Remarks, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, ApprovalProgress, ApprovalVersion } = req.body;
    const amountinwords=convertAmountToWords(Amount);
    const updated = await Check.update({ Status, LinkID, DisbursementID, BankID, SignatoryType, AccountNumber, AccountName, CheckNumber, BRSTN, CheckDate, Payee, Amount, Words:amountinwords, SignatoryOneID, SignatoryTwoID, Remarks, Active, CreatedBy, CreatedDate, ModifyBy, ModifyDate, ApprovalProgress, ApprovalVersion }, {
      where: { ID: req.params.id }
    });
    console.log(updated)
    console.log("req.params.id",req.params.id)
    if (updated) {
      const updatedItem = await Check.findOne({
        where:{
          ID:req.params.id
        }
      })
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "check not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Check.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "check deleted" });
    else res.status(404).json({ message: "check not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};