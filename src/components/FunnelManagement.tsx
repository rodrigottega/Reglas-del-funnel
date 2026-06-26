import React, { useState, useEffect } from 'react';
import { StageId, FunnelStage, Rule, Property } from '../types';
import { INITIAL_STAGES, AGENT_TYPES, PROPERTIES, OPERATORS_BY_TYPE } from '../data';

interface FunnelManagementProps {
  onSave?: (stages: FunnelStage[]) => void;
}

export default function FunnelManagement({ onSave }: FunnelManagementProps) {
  const [stages, setStages] = useState<FunnelStage[]>(() => {
    const saved = localStorage.getItem('ciarem_funnel_stages');
    return saved ? JSON.parse(saved) : INITIAL_STAGES;
  });
  
  const [selectedStageId, setSelectedStageId] = useState<StageId>(() => {
    const saved = localStorage.getItem('ciarem_funnel_stages');
    const parsed = saved ? JSON.parse(saved) : INITIAL_STAGES;
    const defaultStage = parsed.find((s: FunnelStage) => s.id === 'stage_qualified') || parsed[0];
    return defaultStage ? defaultStage.id : '';
  });

  const [isEditingStageMeta, setIsEditingStageMeta] = useState(false);
  const [metaName, setMetaName] = useState('');
  const [metaDesc, setMetaDesc] = useState('');

  const [showAddStageForm, setShowAddStageForm] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  const [showBuilder, setShowBuilder] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [rulePropertyId, setRulePropertyId] = useState<string>('budget');
  const [ruleOperator, setRuleOperator] = useState<string>('has_value');
  
  const [ruleValueText, setRuleValueText] = useState('');
  const [ruleValueNumber, setRuleValueNumber] = useState<number>(0);
  const [ruleValueMin, setRuleValueMin] = useState<string>('');
  const [ruleValueMax, setRuleValueMax] = useState<string>('');
  const [ruleValueSelectedOptions, setRuleValueSelectedOptions] = useState<string[]>([]);

  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [builderError, setBuilderError] = useState<string | null>(null);

  const [ruleToDeleteId, setRuleToDeleteId] = useState<string | null>(null);
  const [newlyAddedRuleId, setNewlyAddedRuleId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentStage = stages.find(s => s.id === selectedStageId);

  useEffect(() => {
    if (stages.length > 0 && (!selectedStageId || !stages.some(s => s.id === selectedStageId))) {
      setSelectedStageId(stages[0].id);
    }
  }, [stages, selectedStageId]);

  useEffect(() => {
    if (currentStage) {
      setMetaName(currentStage.name);
      setMetaDesc(currentStage.description);
      setIsEditingStageMeta(false);
    }
  }, [selectedStageId, stages]);

  const selectedProperty = PROPERTIES.find(p => p.id === rulePropertyId) || PROPERTIES[0];

  useEffect(() => {
    if (selectedProperty) {
      const allowedOperators = OPERATORS_BY_TYPE[selectedProperty.type];
      if (allowedOperators && allowedOperators.length > 0) {
        setRuleOperator(allowedOperators[0].id);
      }
    }
  }, [rulePropertyId]);

  useEffect(() => {
    setRuleValueText('');
    setRuleValueNumber(0);
    setRuleValueMin('');
    setRuleValueMax('');
    setRuleValueSelectedOptions([]);
    setBuilderError(null);
  }, [ruleOperator, rulePropertyId]);

  const hasEntryStage = stages.some(s => s.systemRole === 'entry');

  const handleSetAsInitialStage = (stageId: string) => {
    const updated = stages.map(s => {
      const isTarget = s.id === stageId;
      return {
        ...s,
        systemRole: (isTarget ? 'entry' : 'none') as 'none' | 'entry',
        movementMode: isTarget ? ('automatic' as const) : s.movementMode
      };
    });
    setStages(updated);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const handleChooseDefaultEntryStage = () => {
    if (stages.length > 0) {
      const targetId = selectedStageId || stages[0].id;
      handleSetAsInitialStage(targetId);
    }
  };

  const getCriticalErrors = () => {
    const errors: string[] = [];
    if (!hasEntryStage) {
      errors.push('Falta una etapa inicial en el funnel.');
    }
    stages.forEach(s => {
      if (s.systemRole !== 'entry' && s.movementMode === 'automatic') {
        if (s.agentsAllowed.length === 0) {
          errors.push(`La etapa "${s.name}" está en modo automático pero no tiene agentes seleccionados.`);
        }
        if (s.rules.length === 0) {
          errors.push(`La etapa "${s.name}" está en modo automático pero no tiene reglas configuradas.`);
        }
      }
    });
    return errors;
  };

  const criticalErrors = getCriticalErrors();

  const handleSaveChanges = () => {
    if (criticalErrors.length > 0) return;
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(stages));
    if (onSave) onSave(stages);
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) return;

    const newStage: FunnelStage = {
      id: `stage_${Date.now()}`,
      name: newStageName.trim(),
      description: newStageDesc.trim() || 'Sin descripción',
      systemRole: 'none',
      movementMode: 'manual',
      agentsAllowed: ['qualifier'],
      ruleMatchMode: 'all',
      rules: []
    };

    const updated = [...stages, newStage];
    setStages(updated);
    setSelectedStageId(newStage.id);
    setNewStageName('');
    setNewStageDesc('');
    setShowAddStageForm(false);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const handleDeleteStage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const stageToDelete = stages.find(s => s.id === id);
    if (!stageToDelete) return;

    if (!window.confirm(`¿Estás seguro de que deseas eliminar la etapa "${stageToDelete.name}"?`)) return;

    const updated = stages.filter(s => s.id !== id);
    setStages(updated);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const handleUpdateStageMeta = () => {
    if (!metaName.trim() || !currentStage) return;

    const updated = stages.map(s => {
      if (s.id === selectedStageId) {
        return { ...s, name: metaName.trim(), description: metaDesc.trim() };
      }
      return s;
    });

    setStages(updated);
    setIsEditingStageMeta(false);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stages.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...stages];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setStages(updated);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const handleToggleMovementMode = (mode: 'automatic' | 'manual') => {
    if (!currentStage) return;
    const updated = stages.map(s => {
      if (s.id === selectedStageId) return { ...s, movementMode: mode };
      return s;
    });
    setStages(updated);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const handleToggleAgent = (agentId: string) => {
    if (!currentStage) return;
    const isChecked = currentStage.agentsAllowed.includes(agentId);
    const updatedAgents = isChecked 
      ? currentStage.agentsAllowed.filter(id => id !== agentId)
      : [...currentStage.agentsAllowed, agentId];

    const updated = stages.map(s => {
      if (s.id === selectedStageId) return { ...s, agentsAllowed: updatedAgents };
      return s;
    });
    setStages(updated);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const handleToggleRuleMatchMode = (mode: 'all' | 'any') => {
    if (!currentStage) return;
    const updated = stages.map(s => {
      if (s.id === selectedStageId) return { ...s, ruleMatchMode: mode };
      return s;
    });
    setStages(updated);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const operatorNeedsValue = (opId: string) => {
    return !['has_value', 'is_empty', 'is_true', 'is_false'].includes(opId);
  };

  const getRuleDescription = (rule: Rule) => {
    const prop = PROPERTIES.find(p => p.id === rule.propertyId);
    if (!prop) return rule.name;

    const opList = OPERATORS_BY_TYPE[prop.type] || [];
    const opObj = opList.find(o => o.id === rule.operator);
    const opLabel = opObj ? opObj.label.toLowerCase() : rule.operator;

    let valStr = '';
    if (operatorNeedsValue(rule.operator)) {
      if (rule.operator === 'between') {
        const minVal = rule.value?.min ?? '';
        const maxVal = rule.value?.max ?? '';
        const pref = prop.type === 'currency' ? '$' : '';
        valStr = ` entre ${pref}${minVal} y ${pref}${maxVal}`;
      } else if (['more_than_days_ago', 'less_than_days_ago'].includes(rule.operator)) {
        valStr = ` ${rule.value} días`;
      } else if (Array.isArray(rule.value)) {
        valStr = ` [${rule.value.join(', ')}]`;
      } else {
        const pref = prop.type === 'currency' ? '$' : '';
        valStr = ` ${pref}${rule.value}`;
      }
    }

    return `Cuando "${prop.label}" ${opLabel}${valStr}`;
  };

  const handleOpenAddRule = () => {
    setEditingRuleId(null);
    setRuleName('');
    setRulePropertyId('budget');
    setRuleOperator('has_value');
    setRuleValueText('');
    setRuleValueNumber(0);
    setRuleValueMin('');
    setRuleValueMax('');
    setRuleValueSelectedOptions([]);
    setBuilderError(null);
    setShowBuilder(true);
  };

  const handleOpenEditRule = (rule: Rule) => {
    setEditingRuleId(rule.id);
    setRuleName(rule.name);
    setRulePropertyId(rule.propertyId);
    setRuleOperator(rule.operator);

    const prop = PROPERTIES.find(p => p.id === rule.propertyId);
    if (prop) {
      if (rule.operator === 'between') {
        setRuleValueMin(rule.value?.min?.toString() || '');
        setRuleValueMax(rule.value?.max?.toString() || '');
      } else if (Array.isArray(rule.value)) {
        setRuleValueSelectedOptions(rule.value);
      } else if (typeof rule.value === 'number') {
        setRuleValueNumber(rule.value);
        setRuleValueText(rule.value.toString());
      } else {
        setRuleValueText(rule.value || '');
      }
    }
    setBuilderError(null);
    setShowBuilder(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRuleToDeleteId(ruleId);
  };

  const confirmDeleteRule = () => {
    if (!currentStage || !ruleToDeleteId) return;
    const updatedRules = currentStage.rules.filter(r => r.id !== ruleToDeleteId);
    const updated = stages.map(s => {
      if (s.id === selectedStageId) return { ...s, rules: updatedRules };
      return s;
    });
    setStages(updated);
    setRuleToDeleteId(null);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStage) return;

    if (!ruleName.trim()) {
      setBuilderError('Agrega un nombre para esta regla.');
      return;
    }

    let finalValue: any = null;
    const needsValue = operatorNeedsValue(ruleOperator);

    if (needsValue) {
      if (ruleOperator === 'between') {
        if (!ruleValueMin || !ruleValueMax) {
          setBuilderError('Completa el rango de valores.');
          return;
        }
        finalValue = { 
          min: selectedProperty.type === 'number' || selectedProperty.type === 'currency' ? Number(ruleValueMin) : ruleValueMin, 
          max: selectedProperty.type === 'number' || selectedProperty.type === 'currency' ? Number(ruleValueMax) : ruleValueMax 
        };
      } else if (['in', 'not_in', 'contains_any', 'contains_all', 'contains_none'].includes(ruleOperator)) {
        if (ruleValueSelectedOptions.length === 0) {
          setBuilderError('Agrega al menos una opción.');
          return;
        }
        finalValue = ruleValueSelectedOptions;
      } else {
        if (selectedProperty.type === 'number' || selectedProperty.type === 'currency' || ['more_than_days_ago', 'less_than_days_ago'].includes(ruleOperator)) {
          const num = ruleValueText.trim() === '' ? ruleValueNumber : Number(ruleValueText);
          if (isNaN(num)) {
            setBuilderError('Ingresa un número válido.');
            return;
          }
          finalValue = num;
        } else {
          if (!ruleValueText.trim()) {
            setBuilderError('El valor no puede estar vacío.');
            return;
          }
          finalValue = ruleValueText.trim();
        }
      }
    }

    const savedRule: Rule = {
      id: editingRuleId || `rule_${Date.now()}`,
      name: ruleName.trim(),
      propertyId: rulePropertyId,
      operator: ruleOperator,
      value: finalValue
    };

    let updatedRules = [...currentStage.rules];
    if (editingRuleId) {
      updatedRules = updatedRules.map(r => r.id === editingRuleId ? savedRule : r);
    } else {
      updatedRules.unshift(savedRule);
      setNewlyAddedRuleId(savedRule.id);
      setTimeout(() => setNewlyAddedRuleId(null), 1500);
      setToastMessage('Regla agregada');
      setTimeout(() => setToastMessage(null), 3000);
    }

    const updated = stages.map(s => {
      if (s.id === selectedStageId) return { ...s, rules: updatedRules };
      return s;
    });

    setStages(updated);
    setShowBuilder(false);
    setEditingRuleId(null);
    setBuilderError(null);
    localStorage.setItem('ciarem_funnel_stages', JSON.stringify(updated));
  };

  const handleToggleRuleOption = (opt: string) => {
    if (ruleValueSelectedOptions.includes(opt)) {
      setRuleValueSelectedOptions(prev => prev.filter(o => o !== opt));
    } else {
      setRuleValueSelectedOptions(prev => [...prev, opt]);
    }
  };

  const getNaturalLanguagePreview = () => {
    if (!currentStage) return '';
    
    if (currentStage.systemRole === 'entry') {
      return 'Esta etapa recibe los nuevos contactos de forma automática por la plataforma. Los leads recién capturados entrarán directamente aquí.';
    }

    if (currentStage.movementMode === 'manual') {
      return `El agente IA no moverá contactos a esta etapa. El cambio a "${currentStage.name}" debe realizarse de forma manual por un agente humano de tu equipo.`;
    }

    if (currentStage.rules.length === 0) {
      return 'El agente IA necesita reglas configuradas para poder saber en qué momento debe transferir de forma automática un contacto a esta etapa.';
    }

    const connector = currentStage.ruleMatchMode === 'all' ? 'y' : 'o';
    const rulesDesc = currentStage.rules.map(r => {
      const prop = PROPERTIES.find(p => p.id === r.propertyId);
      if (!prop) return '';
      
      const opList = OPERATORS_BY_TYPE[prop.type] || [];
      const opObj = opList.find(o => o.id === r.operator);
      const opLabel = opObj ? opObj.label.toLowerCase() : r.operator;
      
      let valStr = '';
      if (operatorNeedsValue(r.operator)) {
        if (r.operator === 'between') {
          valStr = ` entre ${r.value?.min} y ${r.value?.max}`;
        } else if (Array.isArray(r.value)) {
          valStr = ` (${r.value.join(' o ')})`;
        } else {
          valStr = ` de "${r.value}"`;
        }
      }
      return `que "${prop.label}" ${opLabel}${valStr}`;
    }).filter(Boolean).join(`, ${connector} `);

    const allowedAgentNames = currentStage.agentsAllowed
      .map(id => AGENT_TYPES.find(a => a.id === id)?.name)
      .filter(Boolean);

    let agentsText = '';
    if (allowedAgentNames.length === 0) {
      agentsText = 'Ningún agente tiene permiso para aplicar estas reglas.';
    } else if (allowedAgentNames.length === 1) {
      agentsText = `Solo el "${allowedAgentNames[0]}" podrá aplicar estas reglas durante la conversación.`;
    } else {
      const last = allowedAgentNames.pop();
      agentsText = `Solo el ${allowedAgentNames.join(', ')} y el ${last} podrán aplicar estas reglas durante la conversación.`;
    }

    return `El agente IA moverá el contacto automáticamente a "${currentStage.name}" cuando detecte ${rulesDesc}. ${agentsText}`;
  };

  const renderRuleValueInputs = () => {
    const isRange = ruleOperator === 'between';
    const isSelect = ['equals', 'not_equals'].includes(ruleOperator) && ['single_select'].includes(selectedProperty.type);
    const isMultiSelect = ['in', 'not_in', 'contains_any', 'contains_all', 'contains_none'].includes(ruleOperator) && ['single_select', 'multi_select'].includes(selectedProperty.type);

    if (!operatorNeedsValue(ruleOperator)) return null;

    if (isRange) {
      const placeholderMin = selectedProperty.type === 'currency' ? 'Min (ej. 500)' : 'Mínimo';
      const placeholderMax = selectedProperty.type === 'currency' ? 'Max (ej. 2000)' : 'Máximo';
      return (
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-zinc-700 font-semibold text-[11px]">Rango de valores</label>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              {selectedProperty.type === 'currency' && <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">$</span>}
              <input
                type="number"
                value={ruleValueMin}
                onChange={(e) => setRuleValueMin(e.target.value)}
                placeholder={placeholderMin}
                className={`w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950 h-9 ${selectedProperty.type === 'currency' ? 'pl-6' : ''}`}
              />
            </div>
            <span className="text-zinc-400 text-xs">y</span>
            <div className="relative flex-1">
              {selectedProperty.type === 'currency' && <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">$</span>}
              <input
                type="number"
                value={ruleValueMax}
                onChange={(e) => setRuleValueMax(e.target.value)}
                placeholder={placeholderMax}
                className={`w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950 h-9 ${selectedProperty.type === 'currency' ? 'pl-6' : ''}`}
              />
            </div>
          </div>
        </div>
      );
    }

    if (isSelect && selectedProperty.options) {
      return (
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-zinc-700 font-semibold text-[11px]">Seleccionar opción</label>
          <select
            value={ruleValueText}
            onChange={(e) => setRuleValueText(e.target.value)}
            className="w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950 h-9 cursor-pointer"
          >
            <option value="">-- Elige una opción --</option>
            {selectedProperty.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      );
    }

    if (isMultiSelect && selectedProperty.options) {
      return (
        <div className="space-y-1.5 md:col-span-2">
          <label className="block text-zinc-700 font-semibold text-[11px]">Seleccionar opciones (marca una o más)</label>
          <div className="flex flex-wrap gap-1.5 p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
            {selectedProperty.options.map(opt => {
              const isSelected = ruleValueSelectedOptions.includes(opt);
              return (
                <button
                  type="button"
                  key={opt}
                  onClick={() => handleToggleRuleOption(opt)}
                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer border flex items-center gap-1 ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-350'
                  }`}
                >
                  {isSelected && <i className="ri-check-line"></i>}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    const isNumeric = selectedProperty.type === 'number' || selectedProperty.type === 'currency' || ['more_than_days_ago', 'less_than_days_ago'].includes(ruleOperator);
    const suffix = ['more_than_days_ago', 'less_than_days_ago'].includes(ruleOperator) ? ' días' : '';

    return (
      <div className="space-y-1.5 md:col-span-2">
        <label className="block text-zinc-700 font-semibold text-[11px]">Valor esperado</label>
        <div className="relative">
          {selectedProperty.type === 'currency' && <span className="absolute left-3 top-2.5 text-zinc-400 text-xs">$</span>}
          <input
            type={isNumeric ? 'number' : selectedProperty.type === 'date' ? 'date' : 'text'}
            value={ruleValueText}
            onChange={(e) => setRuleValueText(e.target.value)}
            placeholder={isNumeric ? 'Ej. 500' : 'Escribe un valor'}
            className={`w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950 h-9 ${selectedProperty.type === 'currency' ? 'pl-6' : ''}`}
          />
          {suffix && <span className="absolute right-3 top-2 text-zinc-400 text-[11px] font-medium">{suffix}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {/* 1. TOP HEADER SECTION */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-zinc-950 tracking-tight leading-none">Manejo del funnel</h1>
          <p className="text-[13px] text-zinc-500 mt-2">
            Configura el flujo de tus etapas y define con precisión cuándo el agente de IA puede automatizar el cambio de etapa de tus contactos.
          </p>
        </div>
        <button 
          onClick={handleSaveChanges}
          disabled={criticalErrors.length > 0}
          className={`font-semibold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 h-9 ${
            criticalErrors.length > 0
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200'
              : 'bg-zinc-950 hover:bg-zinc-850 text-white shadow-xs'
          }`}
        >
          <i className="ri-save-line text-[14px]"></i>
          Guardar cambios
        </button>
      </div>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <div className="bg-zinc-50/60 border border-zinc-200 rounded-2xl p-4 flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT PANEL: FUNNEL STAGES LIST */}
          <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-xl p-4 space-y-4">
            
            {/* Contextual missing entry stage callout */}
            {!hasEntryStage && (
              <div className="rounded-xl border border-zinc-200 bg-white p-3.5 space-y-2.5 animate-in fade-in">
                <div className="flex gap-2">
                  <i className="ri-information-line h-4 w-4 text-zinc-500 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900">Falta una etapa inicial</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-normal">
                      Selecciona qué etapa recibirá los contactos nuevos.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleChooseDefaultEntryStage}
                  className="w-full text-center bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  Elegir etapa
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-zinc-900 text-sm">Etapas del funnel</h2>
                <p className="text-zinc-500 text-[11px] mt-0.5">Reorganiza y selecciona las etapas del pipeline.</p>
              </div>
              <button
                onClick={() => setShowAddStageForm(!showAddStageForm)}
                className="bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-lg p-1 px-2.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <i className="ri-add-line"></i> Nueva
              </button>
            </div>

            {/* Inline add stage form */}
            {showAddStageForm && (
              <form onSubmit={handleAddStage} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5 animate-in slide-in-from-top-2">
                <p className="text-zinc-900 font-bold text-xs">Crear nueva etapa</p>
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    value={newStageName}
                    onChange={(e) => setNewStageName(e.target.value)}
                    placeholder="Nombre (ej. Demo agendada)"
                    className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-955 h-8 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="text"
                    value={newStageDesc}
                    onChange={(e) => setNewStageDesc(e.target.value)}
                    placeholder="Descripción de la etapa..."
                    className="w-full text-xs p-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-955 h-8 bg-white"
                  />
                </div>
                <div className="flex gap-1.5 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddStageForm(false)}
                    className="bg-white border border-zinc-200 text-zinc-700 text-[10px] font-bold px-2 py-1 rounded cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-zinc-950 hover:bg-zinc-850 text-white text-[10px] font-bold px-3 py-1 rounded cursor-pointer"
                  >
                    Agregar etapa
                  </button>
                </div>
              </form>
            )}

            {/* Stages Scroll Container */}
            <div className="space-y-2">
              {stages.map((stage, idx) => {
                const isSelected = stage.id === selectedStageId;
                const rulesCount = stage.rules.length;

                return (
                  <div
                    key={stage.id}
                    onClick={() => {
                      setSelectedStageId(stage.id);
                      setShowBuilder(false);
                      setEditingRuleId(null);
                    }}
                    className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-zinc-955 bg-zinc-50/70 shadow-xs'
                        : 'border-zinc-200 bg-white hover:border-zinc-350 hover:bg-zinc-50/20'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-zinc-955 rounded-r-md"></div>
                    )}

                    <div className="flex items-start justify-between gap-1">
                      <div className="space-y-1 pr-1 flex-1 min-w-0">
                        <span className={`font-bold text-xs truncate block ${isSelected ? 'text-zinc-955' : 'text-zinc-800'}`}>
                          {stage.name}
                        </span>
                        <p className="text-[10.5px] text-zinc-400 truncate font-medium">
                          {stage.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          onClick={(e) => handleMoveStage(idx, 'up', e)}
                          disabled={idx === 0}
                          className={`p-0.5 rounded hover:bg-zinc-100 ${idx === 0 ? 'opacity-30 cursor-not-allowed' : 'text-zinc-400 hover:text-zinc-600'}`}
                        >
                          <i className="ri-arrow-up-s-line text-xs font-bold"></i>
                        </button>
                        <button
                          onClick={(e) => handleMoveStage(idx, 'down', e)}
                          disabled={idx === stages.length - 1}
                          className={`p-0.5 rounded hover:bg-zinc-100 ${idx === stages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'text-zinc-400 hover:text-zinc-600'}`}
                        >
                          <i className="ri-arrow-down-s-line text-xs font-bold"></i>
                        </button>
                        <button
                          onClick={(e) => handleDeleteStage(stage.id, e)}
                          className="p-0.5 rounded text-zinc-350 hover:text-red-600 hover:bg-red-50"
                          title="Eliminar etapa"
                        >
                          <i className="ri-delete-bin-line text-xs"></i>
                        </button>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-zinc-100/65 flex flex-wrap gap-1 items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {stage.systemRole === 'entry' && (
                          <span className="text-[9.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">
                            Etapa inicial
                          </span>
                        )}

                        {stage.systemRole === 'entry' ? (
                          <span className="text-[9.5px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded">
                            Automático
                          </span>
                        ) : stage.movementMode === 'automatic' ? (
                          <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.2 rounded">
                            Automático
                          </span>
                        ) : (
                          <span className="text-[9.5px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded">
                            Manual
                          </span>
                        )}
                      </div>

                      {stage.systemRole !== 'entry' && stage.movementMode === 'automatic' && (
                        <span className="text-[9.5px] text-zinc-400 font-semibold">
                          {rulesCount} {rulesCount === 1 ? 'regla' : 'reglas'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: STAGE DETAILS AND CONFIGURATION */}
          <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-5 space-y-6">
            {currentStage ? (
              <>
                {/* A. HEADER WITH METADATA EDITING */}
                <div className="pb-4 border-b border-zinc-100 flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center text-zinc-700 shrink-0 mt-0.5">
                    {currentStage.systemRole === 'entry' ? (
                      <i className="ri-user-add-line text-lg text-indigo-600"></i>
                    ) : currentStage.movementMode === 'automatic' ? (
                      <i className="ri-git-branch-line text-lg text-emerald-600"></i>
                    ) : (
                      <i className="ri-hand-line text-lg text-zinc-500"></i>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {isEditingStageMeta ? (
                      <div className="space-y-2 max-w-md bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase">Nombre</label>
                          <input
                            type="text"
                            value={metaName}
                            onChange={(e) => setMetaName(e.target.value)}
                            className="w-full text-xs p-1.5 border border-zinc-200 rounded-lg mt-0.5 bg-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-400 uppercase">Descripción</label>
                          <textarea
                            value={metaDesc}
                            onChange={(e) => setMetaDesc(e.target.value)}
                            className="w-full text-xs p-1.5 border border-zinc-200 rounded-lg mt-0.5 bg-white min-h-[50px] resize-none"
                          />
                        </div>
                        <div className="flex gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => setIsEditingStageMeta(false)}
                            className="text-[10px] border border-zinc-200 px-2 py-1 rounded font-bold hover:bg-zinc-100 cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleUpdateStageMeta}
                            className="text-[10px] bg-zinc-900 text-white px-3 py-1 rounded font-bold hover:bg-zinc-800 cursor-pointer"
                          >
                            Guardar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-bold text-zinc-900 text-base">{currentStage.name}</h2>
                          {currentStage.systemRole === 'entry' && (
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                              Etapa inicial
                            </span>
                          )}
                          <button
                            onClick={() => setIsEditingStageMeta(true)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                            title="Editar nombre y descripción de etapa"
                          >
                            <i className="ri-pencil-line text-[12px]"></i>
                          </button>
                        </div>
                        <p className="text-zinc-500 text-xs leading-normal">{currentStage.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* B. DISCRETE ETAPA INICIAL CONFIGURATION SECTION */}
                <div className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-4 space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900">Etapa inicial</h3>
                    <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                      Los contactos nuevos entrarán automáticamente en esta etapa cuando se creen desde formulario, link, WhatsApp, Instagram u otro canal.
                    </p>
                  </div>

                  {currentStage.systemRole === 'entry' ? (
                    <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg text-indigo-700 text-xs font-semibold">
                      <i className="ri-check-line text-sm"></i>
                      <span>Esta es la etapa inicial</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetAsInitialStage(currentStage.id)}
                      className="inline-flex items-center gap-1.5 bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 font-bold text-xs py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      <i className="ri-flag-line text-sm text-zinc-500"></i>
                      <span>Marcar como etapa inicial</span>
                    </button>
                  )}
                </div>

                {/* C. NORMAL STAGE CONTROLS */}
                {currentStage.systemRole !== 'entry' && (
                  <>
                    <div className="space-y-2.5">
                      <h3 className="font-bold text-zinc-900 text-sm">Modo de movimiento</h3>
                      <p className="text-zinc-500 text-xs">
                        Elige si esta etapa se actualiza automáticamente por el agente IA o si solo puede cambiarse manualmente.
                      </p>

                      <div className="flex bg-zinc-100 border border-zinc-200 p-0.5 rounded-lg max-w-xs">
                        <button
                          type="button"
                          onClick={() => handleToggleMovementMode('automatic')}
                          className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            currentStage.movementMode === 'automatic'
                              ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/50'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          Automático
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleMovementMode('manual')}
                          className={`flex-1 text-center py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                            currentStage.movementMode === 'manual'
                              ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/50'
                              : 'text-zinc-500 hover:text-zinc-800'
                          }`}
                        >
                          Manual
                        </button>
                      </div>
                    </div>

                    {currentStage.movementMode === 'manual' && (
                      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 text-center space-y-3">
                        <div className="w-9 h-9 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500 mx-auto">
                          <i className="ri-hand-line text-sm"></i>
                        </div>
                        <h4 className="font-bold text-zinc-900 text-xs">Esta etapa se actualiza manualmente</h4>
                        <p className="text-zinc-500 text-[11px] leading-relaxed max-w-xs mx-auto font-medium">
                          El agente IA no moverá contactos a esta etapa. Un operador humano debe cambiar el estado del lead de forma manual desde el chat o su perfil.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleToggleMovementMode('automatic')}
                          className="bg-zinc-950 hover:bg-zinc-850 text-white font-bold text-xs py-1.5 px-3.5 rounded-lg transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                        >
                          <i className="ri-play-line"></i>
                          Cambiar a automático
                        </button>
                      </div>
                    )}

                    {currentStage.movementMode === 'automatic' && (
                      <div className="space-y-6 pt-1">
                        {/* 1. AGENTES QUE PUEDEN MOVER CONTACTOS */}
                        <div className="space-y-2.5">
                          <div>
                            <h3 className="font-bold text-zinc-900 text-sm">Agentes que pueden mover contactos a esta etapa</h3>
                            <p className="text-zinc-500 text-xs">
                              Selecciona qué tipos de agentes de IA tienen permiso para procesar estas reglas durante la conversación.
                            </p>
                          </div>

                          {currentStage.agentsAllowed.length === 0 && (
                            <div className="rounded-lg border border-zinc-200 bg-white px-3 py-3 animate-in fade-in">
                              <div className="flex gap-2">
                                <i className="ri-information-line h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-zinc-900">Selecciona al menos un agente</p>
                                  <p className="text-sm text-zinc-500">Al menos un tipo de agente debe poder aplicar estas reglas.</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {AGENT_TYPES.map((agent) => {
                              const isChecked = currentStage.agentsAllowed.includes(agent.id);
                              return (
                                <div 
                                  key={agent.id}
                                  onClick={() => !agent.disabled && handleToggleAgent(agent.id)}
                                  className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                    agent.disabled 
                                      ? 'opacity-50 bg-slate-50 border-slate-100 cursor-not-allowed'
                                      : isChecked
                                        ? 'bg-zinc-50 border-zinc-955/45 cursor-pointer shadow-2xs'
                                        : 'bg-white border-zinc-200 hover:border-zinc-300 cursor-pointer'
                                  }`}
                                >
                                  <div className="mt-0.5">
                                    {isChecked ? (
                                      <div className="w-4 h-4 bg-zinc-950 text-white rounded flex items-center justify-center text-[10px]">
                                        <i className="ri-check-line font-bold"></i>
                                      </div>
                                    ) : (
                                      <div className="w-4 h-4 border border-zinc-300 rounded bg-white"></div>
                                    )}
                                  </div>

                                  <div className="space-y-0.5 leading-tight flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-zinc-900 text-xs">{agent.name}</span>
                                      {agent.badge && (
                                        <span className="bg-amber-50 text-amber-800 border border-amber-100 text-[9px] font-semibold px-1.5 py-0.2 rounded">
                                          {agent.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-zinc-450 leading-normal">
                                      {agent.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. CÓMO DEBEN CUMPLIRSE LAS REGLAS */}
                        <div className="space-y-2.5 pt-2">
                          <div>
                            <h3 className="font-bold text-zinc-900 text-sm">Cómo deben cumplirse las reglas</h3>
                            <p className="text-zinc-500 text-xs">
                              Define si el contacto debe cumplir todas las reglas o solo una de ellas para llegar a esta etapa.
                            </p>
                          </div>

                          <div className="flex items-center gap-4 flex-wrap bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                            <div className="flex bg-zinc-150 border border-zinc-200 p-0.5 rounded-lg">
                              <button
                                type="button"
                                onClick={() => handleToggleRuleMatchMode('all')}
                                className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                  currentStage.ruleMatchMode === 'all'
                                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/50'
                                    : 'text-zinc-500 hover:text-zinc-850'
                                }`}
                              >
                                Todas las reglas
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleRuleMatchMode('any')}
                                className={`px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                  currentStage.ruleMatchMode === 'any'
                                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200/50'
                                    : 'text-zinc-500 hover:text-zinc-850'
                                }`}
                              >
                                Cualquier regla
                              </button>
                            </div>

                            <span className="text-[11.5px] font-semibold text-zinc-600">
                              {currentStage.ruleMatchMode === 'all'
                                ? `Requiere ${currentStage.rules.length} de ${currentStage.rules.length} reglas cumplidas (Lógica AND)`
                                : `Requiere al menos 1 de ${currentStage.rules.length} reglas cumplidas (Lógica OR)`
                              }
                            </span>
                          </div>
                        </div>

                        {/* 3. REGLAS PARA LLEGAR A ESTA ETAPA */}
                        <div className="space-y-2.5 pt-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-zinc-900 text-sm">Reglas para llegar a esta etapa</h3>
                              <p className="text-zinc-500 text-xs">El contacto se moverá automáticamente si cumple con los criterios.</p>
                            </div>
                            
                            {!showBuilder && (
                              <button
                                onClick={handleOpenAddRule}
                                className="bg-zinc-950 hover:bg-zinc-850 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                              >
                                <i className="ri-add-line"></i> Agregar regla
                              </button>
                            )}
                          </div>

                          {currentStage.rules.length === 0 && (
                            <div className="rounded-lg border border-zinc-200 bg-white px-3 py-3 animate-in fade-in">
                              <div className="flex gap-2">
                                <i className="ri-information-line h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-zinc-900">Agrega al menos una regla</p>
                                  <p className="text-sm text-zinc-500">El agente necesita reglas para saber cuándo mover un contacto a esta etapa.</p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            {currentStage.rules.map((rule) => {
                              const isNewlyAdded = newlyAddedRuleId === rule.id;
                              
                              return (
                                <div 
                                  key={rule.id}
                                  className={`bg-white border rounded-xl p-3.5 flex items-center justify-between group transition-all shadow-xs ${
                                    isNewlyAdded ? 'border-zinc-950 bg-zinc-50/50 scale-[1.01]' : 'border-zinc-200 hover:border-zinc-350'
                                  }`}
                                >
                                  <div className="space-y-1 pr-2">
                                    <div className="flex items-center gap-2">
                                      <i className="ri-git-commit-line text-zinc-400"></i>
                                      <span className="font-bold text-zinc-950 text-xs">{rule.name}</span>
                                    </div>
                                    <p className="text-zinc-500 text-[11px] leading-relaxed font-medium">
                                      {getRuleDescription(rule)}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditRule(rule)}
                                      className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-50 rounded-lg cursor-pointer transition-colors"
                                      title="Editar regla"
                                    >
                                      <i className="ri-pencil-line text-xs"></i>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteRule(rule.id)}
                                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                      title="Eliminar regla"
                                    >
                                      <i className="ri-delete-bin-line text-xs"></i>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* E. AGENT NATURAL LANGUAGE UNDERSTANDING PREVIEW */}
                <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-4 space-y-2 mt-4">
                  <div className="flex items-center gap-1.5 text-zinc-900 font-bold text-xs">
                    <i className="ri-eye-line text-zinc-500"></i>
                    <span>Así lo entenderá el agente</span>
                  </div>
                  <p className="text-zinc-600 text-xs leading-relaxed font-semibold">
                    {getNaturalLanguagePreview()}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-zinc-400 space-y-2">
                <i className="ri-focus-2-line text-2xl text-zinc-300"></i>
                <p className="text-sm font-semibold">Selecciona o crea una etapa para ver sus reglas y configuraciones.</p>
              </div>
            )}
          </div>

        </div>
      </div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-zinc-950 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-2 z-50 text-xs font-semibold">
          <i className="ri-check-line text-emerald-400 text-sm"></i>
          {toastMessage}
        </div>
      )}

      {/* Delete Rule Confirmation Modal */}
      {ruleToDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-lg border border-zinc-200 w-full max-w-[400px] p-5 animate-in zoom-in-95 space-y-4">
            <div>
              <h3 className="font-bold text-zinc-900 text-sm">Eliminar regla</h3>
              <p className="text-[12px] text-zinc-500 mt-1.5 leading-relaxed">
                Esta regla dejará de usarse para mover contactos a esta etapa. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button 
                type="button"
                onClick={() => setRuleToDeleteId(null)}
                className="border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-xs font-bold py-1.5 px-3.5 rounded-lg cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={confirmDeleteRule}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Eliminar regla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Rule Modal */}
      {showBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-lg border border-zinc-200 w-full max-w-[550px] flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-zinc-100 flex items-start justify-between bg-white z-10 shrink-0">
              <div>
                <h3 className="font-bold text-zinc-900 text-[15px]">
                  {editingRuleId ? 'Editar regla' : 'Nueva regla'}
                </h3>
                {!editingRuleId && (
                  <p className="text-[12px] text-zinc-500 mt-1 leading-relaxed pr-4">
                    Define una condición para que el agente IA sepa cuándo puede mover un contacto a esta etapa.
                  </p>
                )}
              </div>
              <button 
                onClick={() => {
                  setShowBuilder(false);
                  setEditingRuleId(null);
                  setBuilderError(null);
                }}
                className="p-1 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 cursor-pointer transition-colors"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto bg-zinc-50/30 flex-1 min-h-0">
              <form id="rule-builder-form" onSubmit={handleSaveRule} className="space-y-4">
                {builderError && (
                  <div className="bg-red-50 border border-red-200 text-red-950 p-3 rounded-lg text-xs font-semibold animate-in fade-in flex items-start gap-1.5">
                    <i className="ri-alert-line text-red-500 mt-0.5"></i>
                    <span>{builderError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="block text-zinc-700 font-semibold text-[11px]">Nombre de la regla</label>
                    <input 
                      type="text" 
                      required
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      placeholder="Ej. Presupuesto confirmado"
                      className="w-full text-xs p-2.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950 h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-700 font-semibold text-[11px]">Dato a revisar</label>
                    <select 
                      value={rulePropertyId}
                      onChange={(e) => setRulePropertyId(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950 h-9 cursor-pointer font-medium"
                    >
                      {Array.from(new Set(PROPERTIES.map(p => p.group))).map(groupName => (
                        <optgroup key={groupName} label={groupName}>
                          {PROPERTIES.filter(p => p.group === groupName).map(p => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-zinc-700 font-semibold text-[11px]">Condición</label>
                    <select 
                      value={ruleOperator}
                      onChange={(e) => setRuleOperator(e.target.value)}
                      className="w-full text-xs p-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950 h-9 cursor-pointer font-medium"
                    >
                      {(OPERATORS_BY_TYPE[selectedProperty.type] || []).map(op => (
                        <option key={op.id} value={op.id}>{op.label}</option>
                      ))}
                    </select>
                  </div>

                  {renderRuleValueInputs()}
                </div>

                <div className="bg-white border border-zinc-200 p-3 rounded-lg space-y-1">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Así se verá esta regla</span>
                  <div className="text-zinc-800 text-xs flex items-center gap-1.5 flex-wrap font-medium mt-1">
                    <span>Cuando</span>
                    <span className="font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded text-[11px]">{selectedProperty.label}</span>
                    <i className="ri-arrow-right-line text-[10px] text-zinc-400"></i>
                    <span className="font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded text-[11px]">
                      {(OPERATORS_BY_TYPE[selectedProperty.type] || []).find(o => o.id === ruleOperator)?.label.toLowerCase() || ruleOperator}
                    </span>
                    {operatorNeedsValue(ruleOperator) && (
                      <>
                        <i className="ri-arrow-right-line text-[10px] text-zinc-400"></i>
                        <span className="font-bold text-zinc-955 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded text-[11px]">
                          {ruleOperator === 'between' 
                            ? `${selectedProperty.type === 'currency' ? '$' : ''}${ruleValueMin} y ${selectedProperty.type === 'currency' ? '$' : ''}${ruleValueMax}`
                            : ['in', 'not_in', 'contains_any', 'contains_all', 'contains_none'].includes(ruleOperator)
                              ? ruleValueSelectedOptions.join(', ') || 'sin opciones'
                              : `${selectedProperty.type === 'currency' ? '$' : ''}${ruleValueText || '...'}`
                          }
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex gap-2 justify-end shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setShowBuilder(false);
                  setEditingRuleId(null);
                  setBuilderError(null);
                }}
                className="border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 text-xs font-bold py-1.5 px-3.5 rounded-lg cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                form="rule-builder-form"
                disabled={!ruleName.trim()}
                className={`text-xs font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center gap-1.5 ${
                  !ruleName.trim() 
                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed border border-zinc-200' 
                    : 'bg-zinc-950 hover:bg-zinc-850 text-white shadow-xs cursor-pointer'
                }`}
              >
                {editingRuleId ? 'Guardar cambios' : 'Agregar regla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
