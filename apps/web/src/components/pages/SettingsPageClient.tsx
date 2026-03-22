"use client";

import { useState } from "react";
import { Building2, Check, Mail, MapPin, UserRound } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUiStore } from "../../store/uiStore";

export function SettingsPageClient() {
  const pushToast = useUiStore((state) => state.pushToast);
  const [teacherName, setTeacherName] = useState("John Doe");
  const [teacherEmail, setTeacherEmail] = useState("john.doe@vedaai.school");
  const [schoolName, setSchoolName] = useState("Delhi Public School");
  const [campus, setCampus] = useState("Bokaro Steel City");

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] p-6 lg:p-8">
        <h2 className="text-[28px] font-semibold tracking-tight text-[#18181b]">Settings</h2>
        <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-[#71717a]">
          Keep teacher identity, school metadata, and export defaults accurate so generated papers stay presentation-ready.
        </p>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <Card className="rounded-[24px] p-5 lg:p-6">
          <div className="text-[18px] font-semibold text-[#18181b]">Teacher profile</div>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-[#18181b]">
                <UserRound className="h-4 w-4" />
                Teacher name
              </div>
              <Input value={teacherName} onChange={(event) => setTeacherName(event.target.value)} />
            </label>
            <label className="block">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-[#18181b]">
                <Mail className="h-4 w-4" />
                Teacher email
              </div>
              <Input value={teacherEmail} onChange={(event) => setTeacherEmail(event.target.value)} />
            </label>
          </div>
        </Card>

        <Card className="rounded-[24px] p-5 lg:p-6">
          <div className="text-[18px] font-semibold text-[#18181b]">School profile</div>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-[#18181b]">
                <Building2 className="h-4 w-4" />
                School name
              </div>
              <Input value={schoolName} onChange={(event) => setSchoolName(event.target.value)} />
            </label>
            <label className="block">
              <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-[#18181b]">
                <MapPin className="h-4 w-4" />
                Campus
              </div>
              <Input value={campus} onChange={(event) => setCampus(event.target.value)} />
            </label>
          </div>
        </Card>
      </div>

      <Card className="rounded-[24px] p-5 lg:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-[18px] font-semibold text-[#18181b]">Save interface preferences</div>
            <div className="mt-2 text-[13px] leading-6 text-[#71717a]">
              These values are currently frontend-first and intended to make the shell interactive while backend profile settings are still in progress.
            </div>
          </div>
          <Button
            variant="dark"
            onClick={() =>
              pushToast({
                title: "Settings updated",
                description: "Teacher and school details were saved locally for this demo session.",
                tone: "success"
              })
            }
          >
            <Check className="h-4 w-4" />
            Save changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
