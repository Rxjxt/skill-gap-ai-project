import requests
import sys
import json
from datetime import datetime

class SkillGapAITester:
    def __init__(self, base_url="https://learnmap-14.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_data = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@example.com",
            "password": "testpass123"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_data
        )
        
        if success and 'token' in response and 'user' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        # Use a known test account or create one
        test_data = {
            "email": "test@example.com",
            "password": "testpass123"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=test_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_get_user_profile(self):
        """Test getting user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_get_career_roles(self):
        """Test getting career roles"""
        success, response = self.run_test(
            "Get Career Roles",
            "GET",
            "roles",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            self.test_role_id = response[0]['id']
            return True
        return False

    def test_get_single_role(self):
        """Test getting a single career role"""
        if not hasattr(self, 'test_role_id'):
            self.log_test("Get Single Role", False, "No role ID available")
            return False
            
        success, response = self.run_test(
            "Get Single Role",
            "GET",
            f"roles/{self.test_role_id}",
            200
        )
        return success

    def test_create_assessment(self):
        """Test creating skill assessment"""
        if not hasattr(self, 'test_role_id'):
            self.log_test("Create Assessment", False, "No role ID available")
            return False
            
        test_data = {
            "career_role_id": self.test_role_id,
            "skills": [
                {"skill_name": "JavaScript", "current_level": 3},
                {"skill_name": "React", "current_level": 2},
                {"skill_name": "Node.js", "current_level": 2}
            ]
        }
        
        success, response = self.run_test(
            "Create Assessment",
            "POST",
            "assessments",
            200,
            data=test_data
        )
        
        if success and 'id' in response:
            self.assessment_id = response['id']
            return True
        return False

    def test_get_assessments(self):
        """Test getting user assessments"""
        success, response = self.run_test(
            "Get Assessments",
            "GET",
            "assessments",
            200
        )
        return success

    def test_gap_analysis(self):
        """Test AI-powered gap analysis"""
        if not hasattr(self, 'assessment_id'):
            self.log_test("Gap Analysis", False, "No assessment ID available")
            return False
            
        success, response = self.run_test(
            "Gap Analysis",
            "POST",
            f"analysis/gap?assessment_id={self.assessment_id}",
            200
        )
        
        if success and 'id' in response:
            self.analysis_id = response['id']
            return True
        return False

    def test_generate_roadmap(self):
        """Test AI-powered roadmap generation"""
        if not hasattr(self, 'analysis_id'):
            self.log_test("Generate Roadmap", False, "No analysis ID available")
            return False
            
        success, response = self.run_test(
            "Generate Roadmap",
            "POST",
            f"roadmap/generate?analysis_id={self.analysis_id}",
            200
        )
        
        if success and 'id' in response:
            self.roadmap_id = response['id']
            return True
        return False

    def test_get_roadmaps(self):
        """Test getting user roadmaps"""
        success, response = self.run_test(
            "Get Roadmaps",
            "GET",
            "roadmap",
            200
        )
        return success

    def test_get_resources(self):
        """Test getting learning resources"""
        success, response = self.run_test(
            "Get Resources",
            "GET",
            "resources",
            200
        )
        return success

    def test_get_resources_filtered(self):
        """Test getting filtered resources"""
        success, response = self.run_test(
            "Get Filtered Resources",
            "GET",
            "resources?difficulty=Beginner&skill=JavaScript",
            200
        )
        return success

    def test_update_progress(self):
        """Test updating skill progress"""
        if not hasattr(self, 'test_role_id'):
            self.log_test("Update Progress", False, "No role ID available")
            return False
            
        test_data = {
            "skill": "JavaScript",
            "progress": 75,
            "notes": "Completed advanced tutorials"
        }
        
        success, response = self.run_test(
            "Update Progress",
            "POST",
            f"progress?career_role_id={self.test_role_id}",
            200,
            data=test_data
        )
        return success

    def test_get_progress(self):
        """Test getting user progress"""
        success, response = self.run_test(
            "Get Progress",
            "GET",
            "progress",
            200
        )
        return success

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting SkillGapAI Backend API Tests")
        print("=" * 50)
        
        # Authentication Tests
        print("\n📋 AUTHENTICATION TESTS")
        if not self.test_user_registration():
            # If registration fails, try login with existing account
            self.test_user_login()
        
        if self.token:
            self.test_get_user_profile()
        
        # Career Roles Tests
        print("\n🎯 CAREER ROLES TESTS")
        self.test_get_career_roles()
        if hasattr(self, 'test_role_id'):
            self.test_get_single_role()
        
        # Assessment Tests
        print("\n📊 ASSESSMENT TESTS")
        if self.token and hasattr(self, 'test_role_id'):
            self.test_create_assessment()
            self.test_get_assessments()
        
        # AI Analysis Tests
        print("\n🤖 AI ANALYSIS TESTS")
        if hasattr(self, 'assessment_id'):
            print("⏳ Running AI Gap Analysis (may take 10-15 seconds)...")
            self.test_gap_analysis()
        
        # Roadmap Tests
        print("\n🗺️ ROADMAP TESTS")
        if hasattr(self, 'analysis_id'):
            print("⏳ Generating AI Roadmap (may take 10-15 seconds)...")
            self.test_generate_roadmap()
            self.test_get_roadmaps()
        
        # Resources Tests
        print("\n📚 RESOURCES TESTS")
        self.test_get_resources()
        self.test_get_resources_filtered()
        
        # Progress Tests
        print("\n📈 PROGRESS TESTS")
        if self.token and hasattr(self, 'test_role_id'):
            self.test_update_progress()
            self.test_get_progress()
        
        # Print Results
        print("\n" + "=" * 50)
        print(f"📊 FINAL RESULTS: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed. Check the details above.")
            return 1

def main():
    tester = SkillGapAITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())