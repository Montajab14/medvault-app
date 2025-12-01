-- active RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Politique : chaque médecin ne voit que ses patients
CREATE POLICY patients_isolated_policy
ON patients
FOR SELECT USING (doctor_id = current_setting('app.current_user')::uuid);

CREATE POLICY patients_modify_policy
ON patients
FOR UPDATE USING (doctor_id = current_setting('app.current_user')::uuid)
WITH CHECK (doctor_id = current_setting('app.current_user')::uuid);
