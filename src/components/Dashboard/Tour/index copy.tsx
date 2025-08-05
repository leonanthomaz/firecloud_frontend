// src/components/Dashboard/Tour/index.tsx
import { useState, useEffect } from "react";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { useTheme } from "@mui/material";
import { changeTutorialCompanyApi } from "../../../services/api/company";
import { useAuth } from "../../../contexts/AuthContext";

const useTourSteps = (): Step[] => [
  {
    target: ".chatbot-status-card",
    content: "Acompanhe aqui o status do seu chatbot e informações básicas",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: ".assistant-button",
    content: "Clique aqui para acessar diretamente seu assistente virtual",
    placement: "bottom",
  },
  {
    target: ".quick-access-section",
    content: "Acesse rapidamente as principais áreas do painel",
    placement: "bottom",
  },
  {
    target: ".interactions-chart",
    content: "Visualize o histórico de interações com seus clientes",
    placement: "top",
  },
  {
    target: ".user-avatar",
    content: "Aqui você pode alterar sua foto de perfil e logo da empresa",
    placement: "right",
  },
];

export default function Tour() {
  const [run, setRun] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const steps = useTourSteps();

  const { state, getToken } = useAuth();
  const token = getToken() || null;
  const company = state.data?.company;

  useEffect(() => {
    // Se empresa não existe ou já concluiu tutorial, não roda o tour
    if (!company || company.tutorial_completed) {
      setLoading(false);
      setRun(false);
      return;
    }

    // Caso contrário, roda o tour depois de 1s
    const timer = setTimeout(() => {
      setRun(true);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [company]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status } = data;

    if (([STATUS.FINISHED, STATUS.SKIPPED] as CallBackProps['status'][]).includes(status)) {
      setRun(false);
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        if (token && company?.id) {
          // Atualiza tutorial_completed e is_new_company no backend
          await changeTutorialCompanyApi(token, company.id);
          console.log("Tour finalizado: tutorial_completed e is_new_company atualizados");
        } else {
          console.warn("Token ou companyId ausente, não foi possível atualizar o tutorial");
        }
      } catch (err) {
        console.error("Erro ao atualizar tutorial após o tour:", err);
      }
    }
  };

  if (loading) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      callback={handleJoyrideCallback}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      spotlightClicks
      spotlightPadding={10}
      disableOverlayClose
      styles={{
        options: {
          zIndex: theme.zIndex.modal + 100,
          primaryColor: theme.palette.primary.main,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: theme.palette.primary.main,
          padding: "8px 16px",
          borderRadius: "4px",
        },
        buttonBack: {
          color: theme.palette.text.secondary,
          marginRight: 8,
        },
      }}
      locale={{
        back: "Voltar",
        close: "Fechar",
        last: "Finalizar",
        next: "Próximo",
        skip: "Pular tour",
      }}
    />
  );
}
