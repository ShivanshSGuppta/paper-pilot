"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { SOCKET_EVENT_NAMES, JobProgress } from "@vedaai/shared";
import { getSocket } from "../lib/socket";
import { useJobStore } from "../store/jobStore";
import { useSocketStore } from "../store/socketStore";
import { useUiStore } from "../store/uiStore";

export function useAssignmentRealtime(assignmentId?: string, jobId?: string) {
  const queryClient = useQueryClient();
  const setJob = useJobStore((state) => state.setJob);
  const setConnected = useSocketStore((state) => state.setConnected);
  const pushToast = useUiStore((state) => state.pushToast);

  useEffect(() => {
    if (!assignmentId && !jobId) return;
    const socket = getSocket();

    const subscribe = () => {
      socket.emit("assignment:subscribe", { assignmentId, jobId });
    };

    const sync = (event: string, payload: JobProgress & { error?: string }) => {
      setJob({
        assignmentId: payload.assignmentId,
        jobId: payload.jobId,
        status: payload.status,
        progress: payload.progress,
        error: payload.error ?? null,
        resultId: payload.resultId ?? null
      });
      useSocketStore.setState({ lastEvent: event, connected: socket.connected });
      if (payload.assignmentId) {
        queryClient.invalidateQueries({ queryKey: ["assignment", payload.assignmentId] });
        queryClient.invalidateQueries({ queryKey: ["result", payload.assignmentId] });
      }
    };

    const onConnect = () => {
      setConnected(true);
      pushToast({ title: "Live updates connected", description: "Assignment status is syncing in real time.", tone: "success" });
      subscribe();
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(SOCKET_EVENT_NAMES.JOB_QUEUED, (payload) => sync(SOCKET_EVENT_NAMES.JOB_QUEUED, payload));
    socket.on(SOCKET_EVENT_NAMES.JOB_STARTED, (payload) => sync(SOCKET_EVENT_NAMES.JOB_STARTED, payload));
    socket.on(SOCKET_EVENT_NAMES.JOB_PROGRESS, (payload) => sync(SOCKET_EVENT_NAMES.JOB_PROGRESS, payload));
    socket.on(SOCKET_EVENT_NAMES.JOB_COMPLETED, (payload) => sync(SOCKET_EVENT_NAMES.JOB_COMPLETED, payload));
    socket.on(SOCKET_EVENT_NAMES.JOB_FAILED, (payload) => sync(SOCKET_EVENT_NAMES.JOB_FAILED, payload));

    if (socket.connected) {
      setConnected(true);
      subscribe();
    } else {
      socket.connect();
    }

    return () => {
      socket.emit("assignment:unsubscribe", { assignmentId, jobId });
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(SOCKET_EVENT_NAMES.JOB_QUEUED);
      socket.off(SOCKET_EVENT_NAMES.JOB_STARTED);
      socket.off(SOCKET_EVENT_NAMES.JOB_PROGRESS);
      socket.off(SOCKET_EVENT_NAMES.JOB_COMPLETED);
      socket.off(SOCKET_EVENT_NAMES.JOB_FAILED);
    };
  }, [assignmentId, jobId, pushToast, queryClient, setConnected, setJob]);
}
