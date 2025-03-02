using BlogPlatform.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BlogPlatform.Models;
using System;
using System.Linq;

namespace BlogPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public ExpenseController(ApplicationDBContext context)
        {
            _context = context;
        }
        [HttpGet]

        public IActionResult GetAllExpense()
        {
            try
            {
                var expenses = _context.Expenses.ToList();
                if(expenses == null || !expenses.Any())
                {
                    return NotFound("No expenses found.");
                }
                return Ok(expenses);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost]

        public IActionResult AddExpense(ExpenseDTO expenseDto)
        {
            try
            {
                if (expenseDto == null) return BadRequest("Invalid expense data");
                var newExpense = new ExpenseModels
                {
                    Id = Guid.NewGuid(),
                    Name = expenseDto.Name,
                    Amount = expenseDto.Amount,
                    Description = expenseDto.Description,
                    Date = expenseDto.Date
                };
                _context.Expenses.Add(newExpense);
                _context.SaveChanges();
                return CreatedAtAction(nameof(GetAllExpense), new { id = newExpense.Id }, newExpense);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("{id:guid}")]

        public IActionResult UpdateExpense([FromRoute]  Guid id, [FromBody]  ExpenseDTO expenseDto)
        {
            try
            {
                var expense = _context.Expenses.Find(id);
                if (expense == null) return NotFound("Expense not found");
                expense.Name = expenseDto.Name;
                expense.Amount = expenseDto.Amount;
                expense.Description = expenseDto.Description;
                expense.Date = expenseDto.Date;
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
        [HttpDelete("{id:guid}")]

        public IActionResult DeleteExpense([FromRoute]  Guid id)
        {
            try
            {
                var expense = _context.Expenses.Find(id);
                if (expense == null) return NotFound("Expense not found");
                _context.Expenses.Remove(expense);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
