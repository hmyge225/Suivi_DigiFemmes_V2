import { createFileRoute } from "@tanstack/react-router";
import { SuiviApp } from "@/components/suivi-app";

export const Route = createFileRoute("/")({ component: SuiviApp });
