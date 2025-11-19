import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { AppError } from '../middleware/errorHandler';

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: env.email.host,
  port: env.email.port,
  secure: env.email.port === 465,
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});

// Verificar conexão
transporter.verify((error) => {
  if (error) {
    console.error('Erro na configuração de email:', error);
  } else {
    console.log('✅ Servidor de email configurado');
  }
});

// Template de email para paciente
const patientEmailTemplate = (appointment: {
  name: string;
  phone: string;
  email: string;
  selectedTreatments: string[];
  datePreferred?: string;
  timePreferred?: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Clínica Odonto Azul</h1>
        </div>
        <div class="content">
          <h2>Olá, ${appointment.name}!</h2>
          <p>Recebemos sua solicitação de agendamento com sucesso!</p>
          <p><strong>Detalhes do agendamento:</strong></p>
          <ul>
            <li><strong>Nome:</strong> ${appointment.name}</li>
            <li><strong>Telefone:</strong> ${appointment.phone}</li>
            <li><strong>Email:</strong> ${appointment.email}</li>
            ${appointment.datePreferred ? `<li><strong>Data preferencial:</strong> ${appointment.datePreferred}</li>` : ''}
            ${appointment.timePreferred ? `<li><strong>Horário preferencial:</strong> ${appointment.timePreferred}</li>` : ''}
          </ul>
          <p>Nossa equipe entrará em contato em breve para confirmar o agendamento.</p>
          <p>Em caso de dúvidas, entre em contato conosco:</p>
          <p>📞 +55 67 99999-0000<br>
          📧 contato@odontoazul.com</p>
        </div>
        <div class="footer">
          <p>Clínica Odonto Azul - Av. Afonso Pena, 4909 – Campo Grande/MS</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template de email para clínica
const clinicEmailTemplate = (appointment: {
  name: string;
  phone: string;
  email: string;
  selectedTreatments: string[];
  datePreferred?: string;
  timePreferred?: string;
  notes?: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #cc0000; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #0066cc; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🦷 Novo Agendamento</h1>
        </div>
        <div class="content">
          <div class="info-box">
            <h3>Dados do Paciente</h3>
            <p><strong>Nome:</strong> ${appointment.name}</p>
            <p><strong>Telefone:</strong> ${appointment.phone}</p>
            <p><strong>Email:</strong> ${appointment.email}</p>
          </div>
          <div class="info-box">
            <h3>Tratamentos Solicitados</h3>
            <ul>
              ${appointment.selectedTreatments.map((t) => `<li>${t}</li>`).join('')}
            </ul>
          </div>
          ${appointment.datePreferred || appointment.timePreferred ? `
          <div class="info-box">
            <h3>Preferências</h3>
            ${appointment.datePreferred ? `<p><strong>Data:</strong> ${appointment.datePreferred}</p>` : ''}
            ${appointment.timePreferred ? `<p><strong>Horário:</strong> ${appointment.timePreferred}</p>` : ''}
          </div>
          ` : ''}
          ${appointment.notes ? `
          <div class="info-box">
            <h3>Observações</h3>
            <p>${appointment.notes}</p>
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendAppointmentEmails = async (appointment: {
  name: string;
  phone: string;
  email: string;
  selectedTreatments: string[];
  datePreferred?: string;
  timePreferred?: string;
  notes?: string;
}): Promise<void> => {
  try {
    // Email para o paciente
    await transporter.sendMail({
      from: env.email.from,
      to: appointment.email,
      subject: 'Agendamento Recebido - Clínica Odonto Azul',
      html: patientEmailTemplate(appointment),
    });

    // Email para a clínica
    await transporter.sendMail({
      from: env.email.from,
      to: env.email.user,
      subject: `Novo Agendamento - ${appointment.name}`,
      html: clinicEmailTemplate(appointment),
    });
  } catch (error) {
    console.error('Erro ao enviar emails:', error);
    // Não lançar erro para não quebrar o fluxo, apenas logar
    // Em produção, considerar usar uma fila de mensagens
  }
};









