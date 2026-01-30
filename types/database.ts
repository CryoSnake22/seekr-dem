export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          subscription_status: 'free' | 'pro'
          subscription_expires_at: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          subscription_status?: 'free' | 'pro'
          subscription_expires_at?: string | null
          stripe_customer_id?: string | null
        }
        Update: {
          full_name?: string | null
          subscription_status?: 'free' | 'pro'
          subscription_expires_at?: string | null
          stripe_customer_id?: string | null
        }
      }
      education: {
        Row: {
          id: string
          user_id: string
          degree: string
          major: string
          university: string
          graduation_date: string | null
          gpa: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          degree: string
          major: string
          university: string
          graduation_date?: string | null
          gpa?: number | null
        }
        Update: {
          degree?: string
          major?: string
          university?: string
          graduation_date?: string | null
          gpa?: number | null
        }
      }
      experience: {
        Row: {
          id: string
          user_id: string
          company: string
          role: string
          start_date: string
          end_date: string | null
          description: string | null
          technologies: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          company: string
          role: string
          start_date: string
          end_date?: string | null
          description?: string | null
          technologies?: string[] | null
        }
        Update: {
          company?: string
          role?: string
          start_date?: string
          end_date?: string | null
          description?: string | null
          technologies?: string[] | null
        }
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_name: string
          proficiency: 'Beginner' | 'Intermediate' | 'Advanced'
          created_at: string
        }
        Insert: {
          user_id: string
          skill_name: string
          proficiency: 'Beginner' | 'Intermediate' | 'Advanced'
        }
        Update: {
          skill_name?: string
          proficiency?: 'Beginner' | 'Intermediate' | 'Advanced'
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          technologies: string[] | null
          github_url: string | null
          demo_url: string | null
          github_synced: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description?: string | null
          technologies?: string[] | null
          github_url?: string | null
          demo_url?: string | null
          github_synced?: boolean | null
        }
        Update: {
          title?: string
          description?: string | null
          technologies?: string[] | null
          github_url?: string | null
          demo_url?: string | null
          github_synced?: boolean | null
        }
      }
      skills_market_data: {
        Row: {
          id: string
          job_role: string
          skill_name: string
          frequency_count: number
          frequency_percentage: number
          priority_level: 'High' | 'Medium' | 'Low'
          last_updated: string
        }
      }
      match_score_history: {
        Row: {
          id: string
          user_id: string
          job_role: string
          match_score: number
          skills_added: string[] | null
          recorded_at: string
        }
        Insert: {
          user_id: string
          job_role: string
          match_score: number
          skills_added?: string[] | null
        }
      }
      ai_chat_messages: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          message: string
          created_at: string
        }
        Insert: {
          user_id: string
          role: 'user' | 'assistant'
          message: string
        }
      }
    }
  }
}
