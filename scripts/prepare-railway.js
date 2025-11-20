#!/usr/bin/env node

/**
 * Script para preparar o schema do Prisma para PostgreSQL no Railway
 * Este script detecta automaticamente se o DATABASE_URL é PostgreSQL
 * e ajusta o schema.prisma adequadamente
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const productionSchemaPath = path.join(__dirname, '../prisma/schema.prisma.production');

// Verificar se DATABASE_URL aponta para PostgreSQL
const databaseUrl = process.env.DATABASE_URL || '';

if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
  console.log('🔍 Detectado PostgreSQL na DATABASE_URL');
  console.log('📝 Preparando schema para PostgreSQL...');

  // Ler o schema de produção
  if (fs.existsSync(productionSchemaPath)) {
    const productionSchema = fs.readFileSync(productionSchemaPath, 'utf8');
    
    // Fazer backup do schema atual
    const currentSchema = fs.readFileSync(schemaPath, 'utf8');
    fs.writeFileSync(path.join(__dirname, '../prisma/schema.prisma.backup'), currentSchema);
    
    // Substituir pelo schema de produção
    fs.writeFileSync(schemaPath, productionSchema);
    
    console.log('✅ Schema atualizado para PostgreSQL');
    console.log('💾 Backup salvo em prisma/schema.prisma.backup');
  } else {
    console.warn('⚠️  Arquivo schema.prisma.production não encontrado');
    console.log('📝 Ajustando schema atual para PostgreSQL...');
    
    // Ajustar o schema atual
    let schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Trocar provider
    schema = schema.replace(/provider = "sqlite"/g, 'provider = "postgresql"');
    
    // Ajustar arrays - String @default("[]") para String[] @default([])
    schema = schema.replace(/String\s+@default\("\[\]"\)/g, 'String[]  @default([])');
    
    // Remover @db.Text (não necessário no PostgreSQL, mas pode ser usado)
    // schema = schema.replace(/\s+@db\.Text/g, '');
    
    // Salvar
    fs.writeFileSync(schemaPath, schema);
    console.log('✅ Schema ajustado para PostgreSQL');
  }
} else {
  console.log('ℹ️  SQLite detectado ou DATABASE_URL não configurada');
  console.log('📝 Mantendo schema original');
}

