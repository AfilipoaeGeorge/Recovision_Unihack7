using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Proxies;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Recovision.Data.Models;
using Microsoft.Extensions.Configuration;


namespace Recovision.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Pacient> Pacienti { get; set; }
        public DbSet<Medic> Medici { get; set; }
        public DbSet<User> Users { get; set; }
        
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Index unic pentru CNP
            modelBuilder.Entity<Pacient>()
                .HasIndex(s => s.CNP)
                .IsUnique()
                .HasFilter("\"CNP\" IS NOT NULL");

            // Index unic pentru Email în Users
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Index unic pentru Email în Pacienti
            modelBuilder.Entity<Pacient>()
                .HasIndex(p => p.Email)
                .IsUnique();

            // Index unic pentru Email în Medici
            modelBuilder.Entity<Medic>()
                .HasIndex(m => m.Email)
                .IsUnique();

            // Index unic pentru CodParafa în Medici
            modelBuilder.Entity<Medic>()
                .HasIndex(m => m.CodParafa)
                .IsUnique()
                .HasFilter("\"CodParafa\" IS NOT NULL AND \"CodParafa\" != ''");
        }
    }
}