using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BlogPlatform.Data;
using BlogPlatform.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BlogPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IncomeController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public IncomeController(ApplicationDBContext context)
        {
            _context = context;
        }

        // Get all incomes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IncomeModels>>> GetAllIncome()
        {
            try
            {
                var income = await _context.Incomes.ToListAsync();
                if (!income.Any())
                {
                    return NotFound("No income found.");
                }
                return Ok(income);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // Get income by ID
        [HttpGet("{id:Guid}")]
        public async Task<ActionResult<IncomeModels>> GetIncomeById(Guid id)
        {
            try
            {
                var income = await _context.Incomes.FindAsync(id);
                if (income == null)
                {
                    return NotFound("Income not found.");
                }
                return Ok(income);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // Add a new income
        [HttpPost]
        public async Task<ActionResult<IncomeModels>> AddIncome(IncomeDTO incomeDTO)
        {
            try
            {
                var newIncome = new IncomeModels
                {
                    Id = Guid.NewGuid(),
                    Name = incomeDTO.Name,
                    Amount = incomeDTO.Amount,
                    Description = incomeDTO.Description,
                    Date = incomeDTO.Date
                };

                _context.Incomes.Add(newIncome);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetIncomeById), new { id = newIncome.Id }, newIncome);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // Update an existing income
        [HttpPut("{id:Guid}")]
        public async Task<ActionResult> UpdateIncome([FromRoute] Guid id, [FromBody] IncomeDTO incomeDTO)
        {
            try
            {
                if (incomeDTO == null)
                {
                    return BadRequest("Invalid Income data.");
                }

                var income = await _context.Incomes.FindAsync(id);
                if (income == null)
                {
                    return NotFound("Income not found.");
                }

                income.Name = incomeDTO.Name;
                income.Amount = incomeDTO.Amount;
                income.Description = incomeDTO.Description;
                income.Date = incomeDTO.Date;

                await _context.SaveChangesAsync();
                return Ok(income);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        // Delete an income
        [HttpDelete("{id:Guid}")]
        public async Task<ActionResult> DeleteIncome([FromRoute] Guid id)
        {
            try
            {
                var income = await _context.Incomes.FindAsync(id);
                if (income == null)
                {
                    return NotFound("Income not found.");
                }

                _context.Incomes.Remove(income);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
