import { FunnelStage, AgentType, Property } from './types';

export const INITIAL_STAGES: FunnelStage[] = [
  {
    id: "stage_entry",
    name: "Nuevo lead",
    description: "Contacto recién creado, capturado por formulario, link, WhatsApp, Instagram.",
    systemRole: "entry",
    movementMode: "automatic",
    agentsAllowed: [],
    ruleMatchMode: "any",
    rules: []
  },
  {
    id: "stage_contacted",
    name: "Contactado",
    description: "Tiene canal digital, volumen o ganas de escalar, caso de uso claro e intención.",
    systemRole: "none",
    movementMode: "automatic",
    agentsAllowed: ["qualifier", "sales", "faq"],
    ruleMatchMode: "any",
    rules: [
      {
        id: "rule_channel",
        name: "Canal digital confirmado",
        propertyId: "primary_channel",
        operator: "has_value",
        value: null
      },
      {
        id: "rule_first_response",
        name: "Primera respuesta recibida",
        propertyId: "last_contact_reply",
        operator: "has_value",
        value: null
      }
    ]
  },
  {
    id: "stage_qualified",
    name: "Calificado",
    description: "El contacto cumple criterios mínimos: interés, necesidad, presupuesto, etc.",
    systemRole: "none",
    movementMode: "automatic",
    agentsAllowed: ["qualifier", "sales"],
    ruleMatchMode: "all",
    rules: [
      {
        id: "rule_need",
        name: "Necesidad identificada",
        propertyId: "need",
        operator: "has_value",
        value: null
      },
      {
        id: "rule_budget",
        name: "Presupuesto confirmado",
        propertyId: "budget",
        operator: "has_value",
        value: null
      },
      {
        id: "rule_intent",
        name: "Intención de avanzar detectada",
        propertyId: "intent",
        operator: "equals",
        value: "Alta"
      }
    ]
  },
  {
    id: "stage_unqualified",
    name: "No calificado",
    description: "Sin canal digital, sin volumen ni intención, o pide soporte humano dedicado.",
    systemRole: "none",
    movementMode: "manual",
    agentsAllowed: ["qualifier", "sales"],
    ruleMatchMode: "any",
    rules: [
      {
        id: "rule_low_volume",
        name: "Volumen insuficiente",
        propertyId: "conversation_volume",
        operator: "less_than",
        value: 20
      },
      {
        id: "rule_low_intent",
        name: "No muestra intención",
        propertyId: "intent",
        operator: "equals",
        value: "Baja"
      }
    ]
  },
  {
    id: "stage_lost",
    name: "Perdido",
    description: "Evaluó pero no avanzó: precio, momento o eligió otra opción.",
    systemRole: "none",
    movementMode: "manual",
    agentsAllowed: ["sales"],
    ruleMatchMode: "any",
    rules: [
      {
        id: "rule_price",
        name: "Precio fuera de rango",
        propertyId: "loss_reason",
        operator: "contains",
        value: "precio"
      },
      {
        id: "rule_no_reply",
        name: "Sin respuesta reciente",
        propertyId: "days_without_reply",
        operator: "greater_than",
        value: 14
      }
    ]
  },
  {
    id: "stage_customer",
    name: "Cliente",
    description: "Tiene un plan pago activo. Conversión ganada.",
    systemRole: "none",
    movementMode: "automatic",
    agentsAllowed: [],
    ruleMatchMode: "all",
    rules: []
  }
];

export const PROPERTIES: Property[] = [
  {
    id: "budget",
    label: "Presupuesto",
    type: "currency",
    group: "Propiedades de contacto"
  },
  {
    id: "need",
    label: "Necesidad",
    type: "text",
    group: "Propiedades de contacto"
  },
  {
    id: "country",
    label: "País",
    type: "single_select",
    group: "Propiedades de contacto",
    options: ["México", "Colombia", "Chile", "Argentina", "Estados Unidos"]
  },
  {
    id: "primary_channel",
    label: "Canal principal",
    type: "single_select",
    group: "Propiedades de contacto",
    options: ["WhatsApp", "Instagram", "Web chat", "Facebook Messenger", "Email"]
  },
  {
    id: "digital_channel",
    label: "Canal digital",
    type: "multi_select",
    group: "Propiedades de contacto",
    options: ["WhatsApp", "Instagram", "Web chat", "Facebook Messenger", "Email"]
  },
  {
    id: "conversation_volume",
    label: "Volumen de conversaciones",
    type: "number",
    group: "Propiedades de contacto"
  },
  {
    id: "contact_origin",
    label: "Origen del contacto",
    type: "single_select",
    group: "Propiedades de contacto",
    options: ["Formulario", "Link", "WhatsApp", "Instagram", "Carga manual"]
  },
  {
    id: "intent",
    label: "Intención",
    type: "single_select",
    group: "Datos detectados por el agente",
    options: ["Alta", "Media", "Baja", "Sin detectar"]
  },
  {
    id: "use_case",
    label: "Caso de uso",
    type: "text",
    group: "Datos detectados por el agente"
  },
  {
    id: "main_objection",
    label: "Objeción principal",
    type: "text",
    group: "Datos detectados por el agente"
  },
  {
    id: "loss_reason",
    label: "Motivo de descarte",
    type: "text",
    group: "Datos detectados por el agente"
  },
  {
    id: "interest",
    label: "Interés detectado",
    type: "single_select",
    group: "Datos detectados por el agente",
    options: ["Alto", "Medio", "Bajo", "Sin detectar"]
  },
  {
    id: "last_contact_reply",
    label: "Última respuesta del contacto",
    type: "date",
    group: "Datos del sistema"
  },
  {
    id: "days_without_reply",
    label: "Días sin respuesta",
    type: "number",
    group: "Datos del sistema"
  },
  {
    id: "created_at",
    label: "Fecha de creación",
    type: "date",
    group: "Datos del sistema"
  },
  {
    id: "active_plan",
    label: "Plan activo",
    type: "boolean",
    group: "Datos del sistema"
  }
];

export const OPERATORS_BY_TYPE = {
  text: [
    { id: "has_value", label: "Tiene un valor" },
    { id: "is_empty", label: "Está vacío" },
    { id: "contains", label: "Contiene" },
    { id: "not_contains", label: "No contiene" },
    { id: "equals", label: "Es igual a" },
    { id: "not_equals", label: "Es distinto de" }
  ],
  number: [
    { id: "has_value", label: "Tiene un valor" },
    { id: "is_empty", label: "Está vacío" },
    { id: "equals", label: "Es igual a" },
    { id: "greater_than", label: "Es mayor que" },
    { id: "greater_or_equal", label: "Es mayor o igual que" },
    { id: "less_than", label: "Es menor que" },
    { id: "less_or_equal", label: "Es menor o igual que" },
    { id: "between", label: "Está entre" }
  ],
  currency: [
    { id: "has_value", label: "Tiene un valor" },
    { id: "is_empty", label: "Está vacío" },
    { id: "equals", label: "Es igual a" },
    { id: "greater_than", label: "Es mayor que" },
    { id: "greater_or_equal", label: "Es mayor o igual que" },
    { id: "less_than", label: "Es menor que" },
    { id: "less_or_equal", label: "Es menor o igual que" },
    { id: "between", label: "Está entre" }
  ],
  date: [
    { id: "has_value", label: "Tiene un valor" },
    { id: "is_empty", label: "Está vacío" },
    { id: "before", label: "Es antes de" },
    { id: "after", label: "Es después de" },
    { id: "between", label: "Está entre" },
    { id: "more_than_days_ago", label: "Hace más de X días" },
    { id: "less_than_days_ago", label: "Hace menos de X días" }
  ],
  boolean: [
    { id: "is_true", label: "Es sí" },
    { id: "is_false", label: "Es no" }
  ],
  single_select: [
    { id: "equals", label: "Es" },
    { id: "not_equals", label: "No es" },
    { id: "in", label: "Es una de estas opciones" },
    { id: "not_in", label: "No es ninguna de estas opciones" },
    { id: "has_value", label: "Tiene un valor" },
    { id: "is_empty", label: "Está vacío" }
  ],
  multi_select: [
    { id: "contains_any", label: "Contiene cualquiera de estas opciones" },
    { id: "contains_all", label: "Contiene todas estas opciones" },
    { id: "contains_none", label: "No contiene ninguna de estas opciones" },
    { id: "has_value", label: "Tiene un valor" },
    { id: "is_empty", label: "Está vacío" }
  ]
};

export const AGENT_TYPES: AgentType[] = [
  {
    id: "qualifier",
    name: "Agente calificador",
    description: "Recopila datos clave antes de pasar al siguiente paso.",
  },
  {
    id: "sales",
    name: "Agente comercial",
    description: "Responde dudas de compra y ayuda a avanzar la oportunidad.",
  },
  {
    id: "faq",
    name: "Agente de preguntas frecuentes",
    description: "Responde dudas usando la información del negocio.",
  },
  {
    id: "citas",
    name: "Agente para agendar citas",
    description: "Ayuda a coordinar citas o reuniones.",
    disabled: true,
    badge: "Próximamente",
  },
  {
    id: "soporte",
    name: "Agente de soporte",
    description: "Atiende dudas o problemas de clientes actuales.",
  },
  {
    id: "facturacion",
    name: "Agente de facturación",
    description: "Responde dudas sobre pagos, facturas o cobros.",
  },
];
