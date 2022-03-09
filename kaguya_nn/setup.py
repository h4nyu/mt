from setuptools import setup

setup(
    name="kaguya_nn",
    version="0.1.0",
    install_requires=[
    ],
    packages=["vision_tools"],
    package_data={"vision_tools": ["py.typed"]},
    extras_require={
        "dev": [
            "pytest",
            "black",
            "pytest-cov",
            "pytest-benchmark",
            "pytest-mypy",
            "mypy",
        ]
    },
)
